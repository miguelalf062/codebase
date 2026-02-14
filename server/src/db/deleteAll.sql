BEGIN;
DELETE FROM module_data_daily;
DELETE FROM module_data_hourly;
DELETE FROM module_data_minute;
DELETE FROM module_data_monthly;
DELETE FROM module_data_weekly;
DELETE FROM module_data_yearly;

DELETE FROM forecast_data_hours;
DELETE FROM forecast_data_days;
DELETE FROM forecast_data_minutes;
DELETE FROM forecast_data_weeks;
DELETE FROM forecast_data_months;
DELETE FROM forecast_data_years;


COMMIT;