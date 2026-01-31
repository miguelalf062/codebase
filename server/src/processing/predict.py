from statsmodels.tsa.api import ExponentialSmoothing
import sys, json
def hourly_prediction(data):
    model_triple = ExponentialSmoothing(data,
        seasonal_periods=60,
        trend='add',
        seasonal='add')

    model_triple_fit = model_triple.fit()
    forecast_triple = model_triple_fit.forecast(60)
    return forecast_triple

def daily_prediction(data):
    model_triple = ExponentialSmoothing(data,
        seasonal_periods=24,
        trend='add',
        seasonal='add')

    model_triple_fit = model_triple.fit()
    forecast_triple = model_triple_fit.forecast(24)
    return forecast_triple

def weekly_prediction(data):
    model_triple = ExponentialSmoothing(data,
        seasonal_periods=7,
        trend='add',
        seasonal='add')

    model_triple_fit = model_triple.fit()
    forecast_triple = model_triple_fit.forecast(7)
    return forecast_triple

def monthly_prediction(data):
    model_triple = ExponentialSmoothing(data,
        seasonal_periods=4,
        trend='add',
        seasonal='add')

    model_triple_fit = model_triple.fit()
    forecast_triple = model_triple_fit.forecast(4)
    return forecast_triple

def yearly_prediction(data):
    model_triple = ExponentialSmoothing(data,
        seasonal_periods=12,
        trend='add',
        seasonal='add')

    model_triple_fit = model_triple.fit()
    forecast_triple = model_triple_fit.forecast(12)
    return forecast_triple

Process_router = {
    "hourly": hourly_prediction,
    "daily": daily_prediction,
    "weekly": weekly_prediction,
    "monthly": monthly_prediction,
    "yearly": yearly_prediction
}

def load_request():
    raw = sys.stdin.read()
    if not raw:
        raise ValueError('Empty Input')
    return json.loads(raw)

def main():
    request = load_request()
    process_request = request["process"]
    data = request["data"]

    if process_request not in Process_router:
        raise ValueError('Invalid Process Request')

    rawPayload = Process_router[process_request](data)
    forecast_list = [float(x) for x in rawPayload]
    # [1,2,3,4] -> { "data": [1,2,3,4]}

    return { "data": forecast_list}

result = main()
print(json.dumps(result))
