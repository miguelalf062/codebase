BEGIN;
ALTER TABLE forecast_data_hours ADD COLUMN id SERIAL PRIMARY KEY;
ALTER TABLE forecast_data_days ADD COLUMN id SERIAL PRIMARY KEY;
ALTER TABLE forecast_data_weeks ADD COLUMN id SERIAL PRIMARY KEY;
ALTER TABLE forecast_data_months ADD COLUMN id SERIAL PRIMARY KEY;
ALTER TABLE forecast_data_years ADD COLUMN id SERIAL PRIMARY KEY;

ALTER TABLE forecast_data_hours ADD COLUMN module_id INTEGER REFERENCES modules(id) NOT NULL;
ALTER TABLE forecast_data_days ADD COLUMN module_id INTEGER REFERENCES modules(id) NOT NULL;
ALTER TABLE forecast_data_weeks ADD COLUMN module_id INTEGER REFERENCES modules(id) NOT NULL;
ALTER TABLE forecast_data_months ADD COLUMN module_id INTEGER REFERENCES modules(id) NOT NULL;
ALTER TABLE forecast_data_years ADD COLUMN module_id INTEGER REFERENCES modules(id) NOT NULL;

ALTER TABLE forecast_data_hours ADD COLUMN hour integer;
ALTER TABLE forecast_data_weeks ADD COLUMN day integer;
ALTER TABLE forecast_data_months ADD COLUMN month integer; 
ALTER TABLE forecast_data_years ADD COLUMN year integer; 

ALTER TABLE forecast_data_hours ADD COLUMN current NUMERIC(10,2);
ALTER TABLE forecast_data_days ADD COLUMN current NUMERIC(10,2);
ALTER TABLE forecast_data_weeks ADD COLUMN current NUMERIC(10,2);
ALTER TABLE forecast_data_months ADD COLUMN current NUMERIC(10,2);
ALTER TABLE forecast_data_years ADD COLUMN current NUMERIC(10,2);

ALTER TABLE forecast_data_hours ADD COLUMN voltage NUMERIC(10,2);
ALTER TABLE forecast_data_days ADD COLUMN voltage NUMERIC(10,2);
ALTER TABLE forecast_data_weeks ADD COLUMN voltage NUMERIC(10,2);
ALTER TABLE forecast_data_months ADD COLUMN voltage NUMERIC(10,2);
ALTER TABLE forecast_data_years ADD COLUMN voltage NUMERIC(10,2);

ALTER TABLE forecast_data_hours ADD COLUMN power NUMERIC(10,2);
ALTER TABLE forecast_data_days ADD COLUMN power NUMERIC(10,2);
ALTER TABLE forecast_data_weeks ADD COLUMN power NUMERIC(10,2);
ALTER TABLE forecast_data_months ADD COLUMN power NUMERIC(10,2);
ALTER TABLE forecast_data_years ADD COLUMN power NUMERIC(10,2);

ALTER TABLE forecast_data_hours ADD COLUMN forecast_timestamp TIMESTAMPTZ NOT NULL DEFAULT date_trunc('hour', now());
ALTER TABLE forecast_data_days ADD COLUMN forecast_timestamp TIMESTAMPTZ NOT NULL DEFAULT date_trunc('day', now());
ALTER TABLE forecast_data_weeks ADD COLUMN forecast_timestamp TIMESTAMPTZ NOT NULL DEFAULT date_trunc('week', now());
ALTER TABLE forecast_data_months ADD COLUMN forecast_timestamp TIMESTAMPTZ NOT NULL DEFAULT date_trunc('month', now());
ALTER TABLE forecast_data_years ADD COLUMN forecast_timestamp TIMESTAMPTZ NOT NULL DEFAULT date_trunc('year', now());
COMMIT;