const StatsCard = ({ stat }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm w-full max-w-full">
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500 text-sm">{stat.title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</p>
          {stat.change && (
            <p className={`text-xs mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change} {stat.trend === 'up' ? '↑' : '↓'} desde el mes pasado
            </p>
          )}
          {stat.subtitle && (
            <p className="text-xs mt-1 text-gray-500">{stat.subtitle}</p>
          )}
        </div>
        <div className={`p-3 w-12 h-12 rounded-full ${stat.trend === 'up' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
          {stat.icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;