import React, { useMemo } from 'react';

const BlogsChart = ({ blogs = [] }) => {
  // ===== ข้อมูล 6 เดือนล่าสุด =====
  const monthlyData = useMemo(() => {
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('th-TH', { month: 'short', year: '2-digit' });
      const posts = blogs.filter(blog => {
        const d = new Date(blog.createdAt);
        return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
      }).length;
      result.push({ month: monthName, posts, key: `m-${date.getFullYear()}-${date.getMonth()}` });
    }
    return result;
  }, [blogs]);

  // ===== ข้อมูลหมวดหมู่ =====
  const categoryData = useMemo(() => {
    const categories = {};
    blogs.forEach(blog => {
      const name = blog.blog_categories?.name || 'อื่นๆ';
      categories[name] = (categories[name] || 0) + 1;
    });
    return Object.entries(categories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [blogs]);

  const maxMonthly = Math.max(...monthlyData.map(d => d.posts), 1);
  const maxCategory = Math.max(...categoryData.map(d => d.count), 1);

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const top = Math.ceil(maxMonthly / 2) * 2 || 2;
    return [top, Math.ceil(top / 2), 0];
  }, [maxMonthly]);

  return (
    <div className="space-y-8">

      {/* ===== Chart 1: บทความรายเดือน (Vertical Bar) ===== */}
      <div>
        <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <i className="bi bi-calendar-event text-amber-600"></i>
          บทความที่เผยแพร่ (6 เดือนล่าสุด)
        </h3>

        <div className="flex gap-3 items-end" style={{ height: '220px' }}>
          {/* Y-axis */}
          <div className="flex flex-col justify-between items-end h-full pb-6 flex-shrink-0" style={{ width: '28px' }}>
            {yTicks.map(t => (
              <span key={t} className="text-xs text-gray-400 leading-none">{t}</span>
            ))}
          </div>

          {/* Bars + X labels */}
          <div className="flex-1 h-full flex flex-col">
            <div className="flex-1 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {yTicks.map(t => (
                  <div key={t} className="w-full border-t border-gray-100" />
                ))}
              </div>
              {/* Bars */}
              <div className="absolute inset-0 flex items-end justify-around gap-1 px-2">
                {monthlyData.map(item => {
                  const heightPct = Math.max((item.posts / maxMonthly) * 100, item.posts > 0 ? 5 : 2);
                  return (
                    <div key={item.key} className="flex flex-col items-center justify-end h-full flex-1 group">
                      <div className="relative w-full flex flex-col items-center justify-end h-full">
                        {item.posts > 0 && (
                          <span className="absolute -top-5 text-xs font-bold text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.posts}
                          </span>
                        )}
                        <div
                          className="w-full rounded-t-md bg-amber-500 hover:bg-amber-600 transition-colors cursor-default"
                          style={{ height: `${heightPct}%`, minHeight: '3px' }}
                          title={`${item.month}: ${item.posts} บทความ`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* X-axis labels */}
            <div className="flex justify-around px-2 mt-1">
              {monthlyData.map(item => (
                <span key={item.key} className="text-xs text-gray-500 text-center flex-1 truncate">
                  {item.month}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 justify-center">
          <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block"></span>
          <span className="text-xs text-gray-500">บทความ</span>
        </div>
      </div>

      {/* ===== Chart 2: หมวดหมู่ (Horizontal Bar) ===== */}
      <div>
        <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <i className="bi bi-tags text-amber-600"></i>
          การจัดกลุ่มตามหมวดหมู่
        </h3>

        {categoryData.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">ยังไม่มีข้อมูลหมวดหมู่</p>
        ) : (
          <div className="space-y-3">
            {categoryData.map((item, idx) => {
              const widthPct = Math.max((item.count / maxCategory) * 100, 4);
              return (
                <div key={`cat-${idx}-${item.name}`} className="flex items-center gap-3 group">
                  <div className="w-32 text-right flex-shrink-0">
                    <span className="text-xs text-gray-600 truncate block" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 hover:bg-blue-600 transition-colors cursor-default"
                      style={{ width: `${widthPct}%`, minWidth: '12px' }}
                      title={`${item.name}: ${item.count} บทความ`}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-6 text-right flex-shrink-0">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 justify-center">
          <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span>
          <span className="text-xs text-gray-500">จำนวน</span>
        </div>
      </div>

    </div>
  );
};

export default BlogsChart;
