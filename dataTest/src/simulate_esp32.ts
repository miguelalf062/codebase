// simulate_esp32.ts
import mqtt from "mqtt";

// Connect to your MQTT broker
const client = mqtt.connect("mqtt://broker.hivemq.com"); // public broker for testing

client.on("connect", () => {
  console.log("✅ Connected to MQTT broker");

  // Simulate 3 modules
  const modules = [1, 2, 3];

  // Send data every second
  setInterval(() => {
    modules.forEach((module_id) => {
      const payload = {
        current: parseFloat((Math.random() * 5 + 1).toFixed(2)), // 1-6 A
        voltage: parseFloat((Math.random() * 20 + 210).toFixed(1)), // 210-230 V
        power: parseFloat((Math.random() * 1000).toFixed(2)), // 0-1000 W
      };

      // Publish to topic like ESP32 would
      client.publish(`home/module${module_id}/data`, JSON.stringify(payload));
      console.log(`Module ${module_id} sent:`, payload);
    });
  }, 1000);
});