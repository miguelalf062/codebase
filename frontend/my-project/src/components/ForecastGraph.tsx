import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

type datasetPoint = { day: string; value: number };
type dataset = datasetPoint[];

type ChartPoint = {
  i: number;               // numeric x
  label: string;           // your display label (hour/day)
  actualValue?: number;
  forecastedValue?: number;
};

const ForecastGraph = (props: {
  realDataSet: dataset;
  forecastedDataSet: dataset;
  label: string;
  unitLabel: string;
}) => {
  const actualCount = props.realDataSet.length;

  // build one merged array with numeric index "i"
  const merged: ChartPoint[] = [];

  props.realDataSet.forEach((p, idx) => {
    merged.push({ i: idx + 1, label: p.day, actualValue: p.value });
  });

  // bridge point to connect lines smoothly (optional)
  if (actualCount > 0) {
    const last = props.realDataSet[actualCount - 1];
    merged.push({ i: actualCount + 1, label: last.day, forecastedValue: last.value });
  }

  props.forecastedDataSet.forEach((p, idx) => {
    const base = actualCount + 1; // after bridge
    merged.push({ i: base + idx + 1, label: p.day, forecastedValue: p.value });
  });

  // "now" line should be right after actual ends (at the bridge start)
  const nowX = actualCount > 0 ? actualCount + 1 : 1;

  // shade forecast area from nowX to end
  const endX = merged.length > 0 ? merged[merged.length - 1].i : nowX;

  return (
    <div className="xl:col-span-3 xl:flex xl:justify-center">
      <div className="flex xl:w-[90%] xl:h-[40vh] justify-center">
        <div className="xl:shadow-xl/20 shadow-xl xl:w-[100%] xl:h-[100%] w-[90%] border-[#2E5E8A] border-1 rounded-[25px] flex justify-center flex-col items-center h-[200px]">
          <h1 className="xl:relative xl:top-4 xl:ml-10 mt-5 text-xl w-full font-bold ml-5 xl:text-2xl">
            {props.label}
          </h1>
          <h1 className="xl:mr-10 text-md w-full text-right mr-5">{props.unitLabel}</h1>

          <LineChart style={{ width: "90%", height: 280 }} data={merged}>
            {actualCount > 0 && (
              <>
                <ReferenceArea x1={nowX} x2={endX} fill="#4535f5" fillOpacity={0.1} />
                <ReferenceLine
                  x={nowX}
                  stroke="#ff0000"
                  strokeDasharray="4 4"
                  label={{ value: "Now", position: "top" }}
                />
              </>
            )}

            <Line stroke="#F5B335" dot={false} dataKey="actualValue" name="Actual" strokeWidth={2} />
            <Line stroke="#4535f5" dot={false} strokeDasharray="6 4" dataKey="forecastedValue" name="Forecast" strokeWidth={2} />

            {/* numeric axis */}
            <XAxis dataKey="i" tickFormatter={(v) => String(v)} />
            <YAxis
              width={40}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}`}
              label={{ value: "kiloWatt-hour", fontSize: 14, angle: -90, position: "insideLeft", textAnchor: "middle" }}
            />

            <CartesianGrid />
            <Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""} />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default ForecastGraph;
