const MonthlyConsumptionComparison = ({currentConsumption = 42, lastMonthConsumption = 80} : {currentConsumption: number, lastMonthConsumption: number}) => {
  const size = 300;
  const strokeWidth = 40;
  const progress = currentConsumption/lastMonthConsumption * 100 > 100 ? 100 : Math.round((currentConsumption/lastMonthConsumption) * 100);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex justify-center items-center scale-75 w-full h-full xl:scale-75">
    <svg width={size} height={size}  viewBox={`0 0 ${size} ${size}`}>
      {/* Background circle (yellow) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#F5B335"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle (blue) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#2E5E8A"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="butt"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} // start from top
        className="transition-all duration-500 ease-out"
      />
      {/* Text in the middle */}
      <text
        x="50%"
        y="35%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.05}
        fontWeight="bold"
        fill="#2E5E8A"
      >
        This Month Consumption
      </text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.15}
        fontWeight="bold"
        fill="#2E5E8A"
      >
        {currentConsumption} kWh
      </text>
      <text
        x="50%"
        y="62.5%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.1}
        fontWeight="bold"
        fill="#F5B335"
      >
        {Math.abs(lastMonthConsumption - currentConsumption)} kWh
      </text>
      <text
        x="72.5%"
        y="62.5%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.1}
        fill={ currentConsumption > lastMonthConsumption ? "#FF0000" : "#00AA00" }
      >
        ▼
      </text>
      <text
        x="50%"
        y="70%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.05}
        fontWeight=""
        fill="#2E5E8A"
      >
        {currentConsumption > lastMonthConsumption ? "more" : "less"} than last month
      </text>
    </svg>
    </div>
  )
}

export default MonthlyConsumptionComparison