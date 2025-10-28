import React, { useState, useEffect, useMemo } from 'react';
import {
    Form,
    Input,
    Button,
    DatePicker,
    Select,
    Divider,
    Row,
    Col,
    Card,
    Typography,
    Steps,
    Alert,
    Space,
    Avatar,
    Upload,
    Checkbox,
    Radio,
    message,
    Modal,
    Image,
    Progress
} from 'antd';
import {
    UserOutlined,
    HomeOutlined,
    TeamOutlined,
    MedicineBoxOutlined,
    CarOutlined,
    SolutionOutlined,
    SmileOutlined,
    FileImageOutlined,
    CheckCircleOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
    PhoneOutlined,
    MailOutlined,
    FormOutlined,
    PlusOutlined,
    LoadingOutlined,
    DeleteOutlined,
    EyeOutlined,
    UploadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

// Import API hooks
import {
    useFetchTeachersByDepartmentQuery
} from '../../redux/features/teachers/teachersApi';

dayjs.locale('th');

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;

const HomeVisits = () => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [formData, setFormData] = useState({});

    // API hook for teachers
    const {
        data: teachersByDepartment = {},
        isLoading: teachersLoading
    } = useFetchTeachersByDepartmentQuery();

    // Flatten teachers from all departments for dropdown
    const allTeachers = React.useMemo(() => {
        const teachers = [];
        Object.keys(teachersByDepartment).forEach(department => {
            teachersByDepartment[department].forEach(teacher => {
                teachers.push({
                    id: teacher.id,
                    name: `${teacher.namePrefix || ''} ${teacher.name}`.trim(),
                    department: department,
                    position: teacher.position,
                    level: teacher.level
                });
            });
        });
        return teachers.sort((a, b) => a.name.localeCompare(b.name));
    }, [teachersByDepartment]);

    // Define steps first, before any functions that might use it
    const steps = [
        {
            title: 'ข้อมูลพื้นฐาน',
            icon: <UserOutlined />,
        },
        {
            title: 'ที่อยู่และสภาพบ้าน',
            icon: <HomeOutlined />,
        },
        {
            title: 'รายละเอียดการเยี่ยม',
            icon: <FormOutlined />,
        },
        {
            title: 'เสร็จสิ้น',
            icon: <CheckCircleOutlined />,
        }
    ];

    // Helper functions
    const getFieldsForStep = (step) => {
        switch (step) {
            case 0:
                return ['studentIdNumber', 'studentName', 'className', 'teacherName', 'visitDate', 'studentBirthDate', 'parentName', 'relationship', 'occupation'];
            case 1:
                return ['mainAddress'];
            case 2:
                return ['visitPurpose', 'summary'];
            default:
                return [];
        }
    };

    const validateAllRequiredFields = async () => {
        try {
            const allRequiredFields = [
                'studentIdNumber', 'studentName', 'className', 'teacherName', 'visitDate',
                'studentBirthDate', 'parentName', 'relationship', 'occupation', 'mainAddress',
                'visitPurpose', 'summary'
            ];

            await form.validateFields(allRequiredFields);
            return true;
        } catch (error) {
            console.error('Validation error:', error);

            // Find which step has the error and navigate to it
            if (error.errorFields && error.errorFields.length > 0) {
                const firstErrorField = error.errorFields[0].name[0];
                const fieldsStep0 = ['studentIdNumber', 'studentName', 'className', 'teacherName', 'visitDate', 'studentBirthDate', 'parentName', 'relationship'];
                const fieldsStep1 = ['occupation', 'mainAddress'];
                const fieldsStep2 = ['visitPurpose', 'summary'];

                if (fieldsStep0.includes(firstErrorField)) {
                    setCurrentStep(0);
                    message.error('กรุณากรอกข้อมูลพื้นฐานให้ครบถ้วน');
                } else if (fieldsStep1.includes(firstErrorField)) {
                    setCurrentStep(1);
                    message.error('กรุณากรอกข้อมูลที่อยู่และสภาพบ้านให้ครบถ้วน');
                } else if (fieldsStep2.includes(firstErrorField)) {
                    setCurrentStep(2);
                    message.error('กรุณากรอกรายละเอียดการเยี่ยมให้ครบถ้วน');
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            return false;
        }
    };

    const nextStep = () => {
        const fieldsToValidate = getFieldsForStep(currentStep);

        form.validateFields(fieldsToValidate)
            .then((values) => {
                console.log('Step', currentStep, 'validated values:', values);

                // Save current step's values to formData state
                setFormData(prev => {
                    const newData = { ...prev, ...values };
                    console.log('Updated formData:', newData);
                    return newData;
                });

                setCurrentStep(currentStep + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .catch(err => {
                console.log('Validation Failed:', err);
                message.error('กรุณากรอกข้อมูลให้ครบถ้วน');
            });
    };

    const prevStep = () => {
        // Save current values before going back
        const currentValues = form.getFieldsValue();
        console.log('Going back from step', currentStep, 'with values:', currentValues);

        setFormData(prev => {
            const newData = { ...prev, ...currentValues };
            console.log('Updated formData when going back:', newData);
            return newData;
        });

        setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Modified onFinish function with fixed variable names
    const onFinish = async (values) => {
        try {
            // Combine saved form data with current step values
            const allValues = { ...formData, ...values };

            console.log('All Form Values:', allValues);

            // Validate required fields
            const requiredFields = [
                'studentIdNumber', 'studentName', 'className', 'teacherName',
                'visitDate', 'studentBirthDate', 'parentName', 'relationship',
                'occupation', 'mainAddress', 'visitPurpose', 'summary'
            ];

            const missingFields = requiredFields.filter(field => {
                const value = allValues[field];

                if (value === null || value === undefined || value === '') {
                    return true;
                }

                if (Array.isArray(value) && value.length === 0) {
                    return true;
                }

                return false;
            });

            if (missingFields.length > 0) {
                const firstMissingField = missingFields[0];
                const fieldsStep0 = ['studentIdNumber', 'studentName', 'className', 'teacherName', 'visitDate', 'studentBirthDate', 'parentName', 'relationship'];
                const fieldsStep1 = ['occupation', 'mainAddress'];
                const fieldsStep2 = ['visitPurpose', 'summary'];

                if (fieldsStep0.includes(firstMissingField)) {
                    setCurrentStep(0);
                    message.error(`กรุณากรอกข้อมูลในขั้นตอนที่ 1: ${missingFields.join(', ')}`);
                } else if (fieldsStep1.includes(firstMissingField)) {
                    setCurrentStep(1);
                    message.error(`กรุณากรอกข้อมูลในขั้นตอนที่ 2: ${missingFields.join(', ')}`);
                } else if (fieldsStep2.includes(firstMissingField)) {
                    setCurrentStep(2);
                    message.error(`กรุณากรอกข้อมูลในขั้นตอนที่ 3: ${missingFields.join(', ')}`);
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            setIsSubmitting(true);
            setUploadProgress(0);

            const uploadFormData = new FormData();

            // Process and clean the data before sending
            for (const [key, value] of Object.entries(allValues)) {
                if (value === undefined || value === null) continue;

                // Convert Day.js date
                if (dayjs.isDayjs(value)) {
                    uploadFormData.append(key, value.format('YYYY-MM-DD'));
                    continue;
                }

                // Convert arrays (Checkbox.Group, Multi-select, etc.)
                if (Array.isArray(value)) {
                    uploadFormData.append(key, value.join(', '));
                    continue;
                }

                // Convert objects (RadioGroup sometimes returns object)
                if (typeof value === 'object' && value !== null) {
                    // Skip Upload fields
                    if (value.fileList) continue;
                    uploadFormData.append(key, JSON.stringify(value));
                    continue;
                }

                // Default case: string/number/boolean
                uploadFormData.append(key, value.toString());
            }

            console.log('=== DEBUG: Final FormData ===');
            for (let [k, v] of uploadFormData.entries()) {
                console.log(k, ':', v);
            }

            // Add uploaded files
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    uploadFormData.append('images', file.originFileObj);
                }
            });

            // Add metadata
            uploadFormData.append('createdAt', new Date().toISOString());
            uploadFormData.append('updatedAt', new Date().toISOString());

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 200);

            // Debug: print everything sent
            console.log('=== DEBUG: Upload FormData Entries ===');
            for (let pair of uploadFormData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }

            const response = await fetch('http://localhost:5000/api/homevisits', {
                method: 'POST',
                body: uploadFormData,
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            const result = await response.json();
            console.log('API Response:', result);

            if (response.ok && result.success) {
                setIsSubmitting(false);
                setShowSuccess(true);
                setCurrentStep(3);
                message.success('บันทึกข้อมูลการเยี่ยมบ้านสำเร็จ!');

                // Reset everything
                form.resetFields();
                setFormData({});
                setFileList([]);
                setUploadProgress(0);

                setTimeout(() => setShowSuccess(false), 5000);
            } else {
                throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
            }

        } catch (error) {
            setIsSubmitting(false);
            setUploadProgress(0);

            let errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';

            if (error.message.includes('HTTP 400')) {
                errorMessage = 'ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่';
            } else if (error.message.includes('HTTP 401')) {
                errorMessage = 'ไม่มีสิทธิ์เข้าถึง กรุณาเข้าสู่ระบบใหม่';
            } else if (error.message.includes('HTTP 500')) {
                errorMessage = 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง';
            } else if (error.message) {
                errorMessage += ': ' + error.message;
            }

            message.error(errorMessage);
            console.error('Error submitting form:', error);
        }
    };

    // File handling functions
    function handleFileChange({ fileList: newFileList }) {
        setFileList(newFileList);
    }

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isJpgOrPng) {
            message.error('คุณสามารถอัพโหลดได้เฉพาะไฟล์รูปภาพ (JPG, PNG, GIF)!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('ขนาดไฟล์ต้องน้อยกว่า 2MB!');
            return false;
        }
        return false;
    }

    function handlePreview(file) {
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    }

    function handleRemove(file) {
        const newFileList = fileList.filter(item => item.uid !== file.uid);
        setFileList(newFileList);
    }

    // File upload configuration
    const uploadProps = {
        name: 'images',
        listType: 'picture-card',
        fileList: fileList,
        onChange: handleFileChange,
        beforeUpload: beforeUpload,
        onPreview: handlePreview,
        onRemove: handleRemove,
        maxCount: 5,
        multiple: true,
        accept: 'image/*',
        customRequest: ({ file, onSuccess, onError, onProgress }) => {
            setTimeout(() => {
                onSuccess(null, file);
            }, 1000);
        }
    };

    const uploadButton = (
        <div>
            {isSubmitting ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>อัพโหลดรูปภาพ</div>
        </div>
    );

    const dateFormat = 'DD/MM/YYYY';

    // Step content function
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <Divider orientation="left" style={{ color: '#1890ff', borderColor: '#1890ff' }}>
                            <UserOutlined /> ข้อมูลการเยี่ยมบ้าน
                        </Divider>

                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item
                                    name="studentIdNumber"
                                    label={<Text strong>เลขประจำตัวนักเรียน</Text>}
                                    rules={[{ required: true, message: 'กรุณากรอกเลขประจำตัวนักเรียน' }]}
                                >
                                    <Input
                                        placeholder="เช่น 12345"
                                        prefix={<FormOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item
                                    name="studentName"
                                    label={<Text strong>ชื่อ-สกุลนักเรียน</Text>}
                                    rules={[{ required: true, message: 'กรุณากรอกชื่อ-สกุลนักเรียน' }]}
                                >
                                    <Input placeholder="ชื่อ-สกุลนักเรียน" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item
                                    name="className"
                                    label={<Text strong>ชั้นเรียน</Text>}
                                    rules={[{ required: true, message: 'กรุณาเลือกชั้นเรียน' }]}
                                >
                                    <Select placeholder="เลือกชั้นเรียน">
                                        <Option value="มัธยม 1/1">มัธยม 1/1</Option>
                                        <Option value="มัธยม 1/2">มัธยม 1/2</Option>
                                        <Option value="มัธยม 2/1">มัธยม 2/1</Option>
                                        <Option value="มัธยม 2/2">มัธยม 2/2</Option>
                                        <Option value="มัธยม 3/1">มัธยม 3/1</Option>
                                        <Option value="มัธยม 3/2">มัธยม 3/1</Option>
                                        <Option value="มัธยม 4/1">มัธยม 4/1</Option>
                                        <Option value="มัธยม 5/1">มัธยม 5/1</Option>
                                        <Option value="มัธยม 6/1">มัธยม 6/1</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item
                                    name="studentBirthDate"
                                    label={<Text strong>วันเกิดนักเรียน</Text>}
                                    rules={[{ required: true, message: 'กรุณาเลือกวันเกิดนักเรียน' }]}
                                >
                                    <DatePicker
                                        format={dateFormat}
                                        style={{ width: '100%' }}
                                        placeholder="เลือกวันเกิด"
                                        suffixIcon={<CalendarOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item
                                    name="teacherName"
                                    label={<Text strong>ครูที่เยี่ยมบ้าน</Text>}
                                    rules={[{ required: true, message: 'กรุณาเลือกชื่อครูที่เยี่ยมบ้าน' }]}
                                >
                                    <Select
                                        placeholder="เลือกครูที่เยี่ยมบ้าน"
                                        showSearch
                                        optionFilterProp="children"
                                    >
                                        {allTeachers.map((teacher) => (
                                            <Option key={teacher.id} value={teacher.name}>
                                                {teacher.name} - {teacher.position} ({teacher.department})
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item
                                    name="visitDate"
                                    label={<Text strong>วันที่เยี่ยมบ้าน</Text>}
                                    rules={[{ required: true, message: 'กรุณาเลือกวันที่เยี่ยมบ้าน' }]}
                                >
                                    <DatePicker
                                        format={dateFormat}
                                        style={{ width: '100%' }}
                                        placeholder="เลือกวันที่"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left" style={{ color: '#1890ff', borderColor: '#1890ff' }}>
                            <TeamOutlined /> ข้อมูลครอบครัว
                        </Divider>

                        <Form.Item
                            name="familyStatus"
                            label={<Text strong>สถานภาพของครอบครัว</Text>}
                        >
                            <Checkbox.Group>
                                <Row>
                                    <Col span={12}><Checkbox value="บิดามารดาอยู่ด้วยกัน">บิดามารดาอยู่ด้วยกัน</Checkbox></Col>
                                    <Col span={12}><Checkbox value="บิดามารดาแยกกันอยู่">บิดามารดาแยกกันอยู่</Checkbox></Col>
                                    <Col span={12}><Checkbox value="บิดาเสียชีวิตแล้ว">บิดาเสียชีวิตแล้ว</Checkbox></Col>
                                    <Col span={12}><Checkbox value="มารดาเสียชีวิตแล้ว">มารดาเสียชีวิตแล้ว</Checkbox></Col>
                                    <Col span={12}><Checkbox value="อยู่กับญาติ">อยู่กับญาติ</Checkbox></Col>
                                    <Col span={12}><Checkbox value="อื่น ๆ">อื่น ๆ</Checkbox></Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="parentName"
                                    label={<Text strong>ชื่อผู้ปกครอง</Text>}
                                    rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ปกครอง' }]}
                                >
                                    <Input placeholder="ชื่อ-สกุลผู้ปกครอง" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="relationship"
                                    label={<Text strong>ความสัมพันธ์</Text>}
                                    rules={[{ required: true, message: 'กรุณาเลือกความสัมพันธ์' }]}
                                >
                                    <Select placeholder="เลือกความสัมพันธ์">
                                        <Option value="บิดา">บิดา</Option>
                                        <Option value="มารดา">มารดา</Option>
                                        <Option value="ปู่">ปู่</Option>
                                        <Option value="ย่า">ย่า</Option>
                                        <Option value="ตา">ตา</Option>
                                        <Option value="ยาย">ยาย</Option>
                                        <Option value="ลุง">ลุง</Option>
                                        <Option value="ป้า">ป้า</Option>
                                        <Option value="น้า">น้า</Option>
                                        <Option value="อา">อา</Option>
                                        <Option value="พี่">พี่</Option>
                                        <Option value="น้อง">น้อง</Option>
                                        <Option value="อื่น ๆ">อื่น ๆ</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="occupation"
                                    label={<Text strong>อาชีพ</Text>}
                                    rules={[{ required: true, message: 'กรุณากรอกอาชีพ' }]}
                                >
                                    <Input placeholder="อาชีพของผู้ปกครอง" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="monthlyIncome"
                                    label={<Text strong>รายได้ต่อเดือน</Text>}
                                >
                                    <Select placeholder="เลือกช่วงรายได้">
                                        <Option value="น้อยกว่า 5,000">น้อยกว่า 5,000 บาท</Option>
                                        <Option value="5,000-10,000">5,000-10,000 บาท</Option>
                                        <Option value="10,001-15,000">10,001-15,000 บาท</Option>
                                        <Option value="15,001-20,000">15,001-20,000 บาท</Option>
                                        <Option value="20,001-25,000">20,001-25,000 บาท</Option>
                                        <Option value="มากกว่า 25,000">มากกว่า 25,000 บาท</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                );
            case 1:
                return (
                    <>
                        <Divider orientation="left" style={{ color: '#1890ff', borderColor: '#1890ff' }}>
                            <EnvironmentOutlined /> ที่อยู่และการติดต่อ
                        </Divider>

                        <Form.Item
                            name="mainAddress"
                            label={<Text strong>ที่อยู่</Text>}
                            rules={[{ required: true, message: 'กรุณากรอกที่อยู่' }]}
                        >
                            <TextArea
                                rows={3}
                                placeholder="ที่อยู่ปัจจุบันของนักเรียน"
                            />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="phoneNumber"
                                    label={<Text strong>เบอร์โทรศัพท์</Text>}
                                >
                                    <Input
                                        placeholder="เบอร์โทรศัพท์"
                                        prefix={<PhoneOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="emergencyContact"
                                    label={<Text strong>เบอร์ฉุกเฉิน</Text>}
                                >
                                    <Input
                                        placeholder="เบอร์โทรฉุกเฉิน"
                                        prefix={<PhoneOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left" style={{ color: '#1890ff', borderColor: '#1890ff' }}>
                            <HomeOutlined /> สภาพบ้านและสิ่งแวดล้อม
                        </Divider>

                        <Form.Item
                            name="houseType"
                            label={<Text strong>ลักษณะบ้าน</Text>}
                        >
                            <Checkbox.Group>
                                <Row>
                                    <Col span={6}><Checkbox value="บ้านตัวเอง">บ้านตัวเอง</Checkbox></Col>
                                    <Col span={6}><Checkbox value="บ้านเช่า">บ้านเช่า</Checkbox></Col>
                                    <Col span={6}><Checkbox value="บ้านญาติ">บ้านญาติ</Checkbox></Col>
                                    <Col span={6}><Checkbox value="อื่น ๆ">อื่น ๆ</Checkbox></Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>

                        <Form.Item
                            name="houseMaterial"
                            label={<Text strong>วัสดุที่ใช้สร้างบ้าน</Text>}
                        >
                            <Checkbox.Group>
                                <Row>
                                    <Col span={8}><Checkbox value="คอนกรีต">คอนกรีต</Checkbox></Col>
                                    <Col span={8}><Checkbox value="ไม้">ไม้</Checkbox></Col>
                                    <Col span={8}><Checkbox value="สังกะสี">สังกะสี</Checkbox></Col>
                                    <Col span={8}><Checkbox value="ไผ่">ไผ่</Checkbox></Col>
                                    <Col span={8}><Checkbox value="ผสม">ผสม</Checkbox></Col>
                                    <Col span={8}><Checkbox value="อื่น ๆ">อื่น ๆ</Checkbox></Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>

                        <Form.Item
                            name="utilities"
                            label={<Text strong>สาธารณูปโภค</Text>}
                        >
                            <Checkbox.Group>
                                <Row>
                                    <Col span={8}><Checkbox value="ไฟฟ้า">ไฟฟ้า</Checkbox></Col>
                                    <Col span={8}><Checkbox value="ประปา">ประปา</Checkbox></Col>
                                    <Col span={8}><Checkbox value="โทรศัพท์">โทรศัพท์</Checkbox></Col>
                                    <Col span={8}><Checkbox value="อินเทอร์เน็ต">อินเทอร์เน็ต</Checkbox></Col>
                                    <Col span={8}><Checkbox value="ก๊าซ">ก๊าซ</Checkbox></Col>
                                    <Col span={8}><Checkbox value="ทีวี">ทีวี</Checkbox></Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>

                        <Form.Item
                            name="environmentCondition"
                            label={<Text strong>สภาพแวดล้อมรอบบ้าน</Text>}
                        >
                            <TextArea
                                rows={3}
                                placeholder="อธิบายสภาพแวดล้อมรอบบ้าน เช่น ใกล้ถนนใหญ่, เงียบสงบ, มีเสียงดัง ฯลฯ"
                            />
                        </Form.Item>

                        <Form.Item
                            name="studyArea"
                            label={<Text strong>พื้นที่สำหรับการเรียน</Text>}
                        >
                            <Radio.Group>
                                <Space direction="vertical">
                                    <Radio value="มีโต๊ะเรียนส่วนตัว">มีโต๊ะเรียนส่วนตัว</Radio>
                                    <Radio value="ใช้โต๊ะร่วมกับครอบครัว">ใช้โต๊ะร่วมกับครอบครัว</Radio>
                                    <Radio value="ไม่มีโต๊ะเรียน">ไม่มีโต๊ะเรียน</Radio>
                                    <Radio value="อื่น ๆ">อื่น ๆ</Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                    </>
                );
            case 2:
                return (
                    <>
                        <Divider orientation="left" style={{ color: '#1890ff', borderColor: '#1890ff' }}>
                            <FormOutlined /> วัตถุประสงค์และผลการเยี่ยม
                        </Divider>

                        <Form.Item
                            name="visitPurpose"
                            label={<Text strong>วัตถุประสงค์ในการเยี่ยมบ้าน</Text>}
                            rules={[{ required: true, message: 'กรุณาระบุวัตถุประสงค์' }]}
                        >
                            <Checkbox.Group>
                                <Row>
                                    <Col span={12}><Checkbox value="ติดตามพฤติกรรม">ติดตามพฤติกรรมนักเรียน</Checkbox></Col>
                                    <Col span={12}><Checkbox value="ติดตามผลการเรียน">ติดตามผลการเรียน</Checkbox></Col>
                                    <Col span={12}><Checkbox value="สร้างความสัมพันธ์">สร้างความสัมพันธ์กับผู้ปกครอง</Checkbox></Col>
                                    <Col span={12}><Checkbox value="แก้ไขปัญหา">แก้ไขปัญหาของนักเรียน</Checkbox></Col>
                                    <Col span={12}><Checkbox value="ให้คำแนะนำ">ให้คำแนะนำการเรียน</Checkbox></Col>
                                    <Col span={12}><Checkbox value="อื่น ๆ">อื่น ๆ</Checkbox></Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>

                        <Form.Item
                            name="studentBehaviorAtHome"
                            label={<Text strong>พฤติกรรมของนักเรียนที่บ้าน</Text>}
                        >
                            <TextArea
                                rows={4}
                                placeholder="อธิบายพฤติกรรมของนักเรียนที่บ้าน เช่น การทำการบ้าน, ความรับผิดชอบ, ความสัมพันธ์กับครอบครัว ฯลฯ"
                            />
                        </Form.Item>

                        <Form.Item
                            name="parentCooperation"
                            label={<Text strong>ความร่วมมือของผู้ปกครอง</Text>}
                        >
                            <TextArea
                                rows={3}
                                placeholder="ความร่วมมือและความสนใจของผู้ปกครองต่อการศึกษาของนักเรียน"
                            />
                        </Form.Item>

                        <Form.Item
                            name="problems"
                            label={<Text strong>ปัญหาที่พบ</Text>}
                        >
                            <TextArea
                                rows={3}
                                placeholder="ปัญหาที่พบจากการเยี่ยมบ้าน (ถ้ามี)"
                            />
                        </Form.Item>

                        <Form.Item
                            name="recommendations"
                            label={<Text strong>ข้อเสนอแนะ</Text>}
                        >
                            <TextArea
                                rows={3}
                                placeholder="ข้อเสนอแนะสำหรับผู้ปกครองและนักเรียน"
                            />
                        </Form.Item>

                        <Form.Item
                            name="summary"
                            label={<Text strong>สรุปผลการเยี่ยมบ้าน</Text>}
                            rules={[{ required: true, message: 'กรุณาสรุปผลการเยี่ยมบ้าน' }]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="สรุปผลการเยี่ยมบ้านโดยรวม ประโยชน์ที่ได้รับ และแผนการติดตามต่อไป"
                            />
                        </Form.Item>

                        <Form.Item
                            name="followUpPlan"
                            label={<Text strong>แผนการติดตาม</Text>}
                        >
                            <TextArea
                                rows={3}
                                placeholder="แผนการติดตามและช่วยเหลือนักเรียนต่อไป"
                            />
                        </Form.Item>

                        <Divider orientation="left" style={{ color: '#1890ff', borderColor: '#1890ff' }}>
                            <FileImageOutlined /> รูปภาพประกอบ
                        </Divider>

                        <Form.Item
                            name="images"
                            label={<Text strong>รูปภาพการเยี่ยมบ้าน</Text>}
                            extra="อัพโหลดรูปภาพการเยี่ยมบ้าน (ไม่เกิน 5 รูป, ขนาดไม่เกิน 2MB ต่อรูป)"
                        >
                            <Upload {...uploadProps}>
                                {fileList.length >= 5 ? null : uploadButton}
                            </Upload>
                        </Form.Item>

                        {isSubmitting && uploadProgress > 0 && (
                            <Form.Item>
                                <Card size="small">
                                    <Progress
                                        percent={uploadProgress}
                                        status={uploadProgress === 100 ? 'success' : 'active'}
                                        strokeColor={{
                                            '0%': '#108ee9',
                                            '100%': '#87d068',
                                        }}
                                    />
                                    <Text type="secondary">กำลังอัพโหลดข้อมูล...</Text>
                                </Card>
                            </Form.Item>
                        )}
                    </>
                );
            case 3:
                return (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '24px' }} />
                        <Title level={3}>บันทึกข้อมูลการเยี่ยมบ้านสำเร็จ!</Title>
                        <Text type="secondary">
                            ข้อมูลการเยี่ยมบ้านของนักเรียนถูกบันทึกเรียบร้อยแล้ว รวมทั้งรูปภาพที่อัพโหลด
                        </Text>
                        <div style={{ marginTop: '24px' }}>
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        form.resetFields();
                                        setCurrentStep(0);
                                        setFileList([]);
                                        setShowSuccess(false);
                                        setUploadProgress(0);
                                    }}
                                    icon={<PlusOutlined />}
                                >
                                    กรอกแบบฟอร์มใหม่
                                </Button>
                                <Button
                                    onClick={() => {
                                        window.location.href = '/admin/home-visits';
                                    }}
                                    icon={<EyeOutlined />}
                                >
                                    ดูรายการเยี่ยมบ้าน
                                </Button>
                            </Space>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{
            padding: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
            background: 'linear-gradient(to bottom, #f0f2f5, #ffffff)',
            minHeight: '100vh'
        }}>
            <Card
                bordered={false}
                style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Avatar
                        size={64}
                        icon={<HomeOutlined />}
                        style={{
                            backgroundColor: '#1890ff',
                            marginBottom: '16px'
                        }}
                    />
                    <Title level={2} style={{ marginBottom: '8px' }}>
                        <HomeOutlined style={{ marginRight: '8px' }} />
                        แบบบันทึกการเยี่ยมบ้านนักเรียน
                    </Title>
                    <Text type="secondary">
                        กรุณากรอกข้อมูลให้ครบถ้วนเพื่อประโยชน์ในการพัฒนานักเรียน
                    </Text>
                </div>

                <Steps
                    current={currentStep}
                    style={{
                        marginBottom: '32px',
                        padding: '0 20px'
                    }}
                    responsive={true}
                >
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} icon={item.icon} />
                    ))}
                </Steps>

                {showSuccess && (
                    <Alert
                        message="บันทึกข้อมูลสำเร็จ!"
                        description="ข้อมูลการเยี่ยมบ้านของนักเรียนถูกบันทึกเรียบร้อยแล้ว พร้อมรูปภาพที่อัพโหลด"
                        type="success"
                        showIcon
                        closable
                        style={{ marginBottom: '24px' }}
                        onClose={() => setShowSuccess(false)}
                    />
                )}

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    preserve={false}
                    initialValues={{
                        visitDate: dayjs(),
                        studentIdNumber: '',
                        studentName: '',
                        className: '',
                        teacherName: '',
                        ...formData  // Spread the saved form data
                    }}
                    scrollToFirstError
                >
                    <div style={{ minHeight: '400px' }}>
                        {getStepContent(currentStep)}
                    </div>

                    {currentStep < steps.length - 1 && (
                        <div style={{
                            marginTop: '24px',
                            textAlign: 'center',
                            borderTop: '1px solid #f0f0f0',
                            paddingTop: '24px'
                        }}>
                            <Space size="large">
                                {currentStep > 0 && (
                                    <Button
                                        size="large"
                                        onClick={prevStep}
                                        style={{ width: '120px' }}
                                        icon={<CarOutlined style={{ transform: 'rotate(180deg)' }} />}
                                    >
                                        ย้อนกลับ
                                    </Button>
                                )}
                                {currentStep < steps.length - 2 && (
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={nextStep}
                                        style={{ width: '120px' }}
                                        icon={<CarOutlined />}
                                    >
                                        ถัดไป
                                    </Button>
                                )}
                                {currentStep === steps.length - 2 && (
                                    <Button
                                        type="primary"
                                        size="large"
                                        loading={isSubmitting}
                                        style={{ width: '140px' }}
                                        icon={isSubmitting ? <LoadingOutlined /> : <UploadOutlined />}
                                        onClick={async () => {
                                            const isValid = await validateAllRequiredFields();
                                            if (isValid) {
                                                form.submit();
                                            }
                                        }}
                                    >
                                        {isSubmitting ? 'กำลังอัพโหลด...' : 'บันทึกข้อมูล'}
                                    </Button>
                                )}
                            </Space>
                        </div>
                    )}
                </Form>
            </Card>

            {/* Image Preview Modal */}
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
                centered
            >
                <Image
                    alt="preview"
                    style={{ width: '100%' }}
                    src={previewImage}
                />
            </Modal>

            {/* Footer */}
            <div style={{
                textAlign: 'center',
                marginTop: '24px',
                color: 'rgba(0, 0, 0, 0.45)',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px'
            }}>
                <Text>
                    โรงเรียนท่าบ่อพิทยาคม | ระบบบันทึกข้อมูลการเยี่ยมบ้านนักเรียน
                </Text>
                <div style={{ marginTop: '8px' }}>
                    <Text>
                        <PhoneOutlined /> 084-930-4710 |
                        <MailOutlined style={{ marginLeft: '12px' }} /> thabopittayakom@gmail.com |
                        <EnvironmentOutlined style={{ marginLeft: '12px' }} /> อำเภอท่าบ่อ จังหวัดหนองคาย
                    </Text>
                </div>
                <div style={{ marginTop: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        สร้างเมื่อ: {new Date().toLocaleString('th-TH')} |
                        รองรับการอัพโหลดไฟล์: JPG, PNG, GIF (สูงสุด 2MB/ไฟล์)
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default HomeVisits;