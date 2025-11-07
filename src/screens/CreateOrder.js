import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";

const CreateOrder = ({ route, navigation }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [orderTime, setOrderTime] = useState("");
  const [slotService, setSlotService] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [service, setService] = useState({});
  const [servicePrice, setServicePrice] = useState("");

  const userId = useSelector((state) => state.auth.user?.id);

  const { serviceId } = route.params;

  useEffect(() => {
    console.log("Nhận `serviceId` từ `route.params`:", serviceId);
    getService();
  }, []);

  // Fetch service details
  const getService = async () => {
    try {
      const res = await axios.get(
        `http://192.168.1.12:9999/store/get-service/${serviceId}`
      );
      setService({
        serviceName: res.data.serviceName,
        servicePrice: res.data.servicePrice,
        storeName: res.data.storeNameName,
        storeAddress: res.data.storeAddress,
        storeId: res.data.storeId,
      });
      setServicePrice(res.data.servicePrice);
      console.log(service);
    } catch (error) {
      console.log("Error fetching service:", error);
    }
  };

  useEffect(() => {
    getService();
  }, []);

  // Handle date selection from Calendar
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // Handle time selection from DateTimePicker
  const onTimeChange = (event, selectedDateTime) => {
    const currentTime = selectedDateTime || new Date();
    setShowTimePicker(false);

    // Lưu thời gian đã chọn với định dạng hệ thống
    setOrderTime(currentTime.toLocaleTimeString()); // Chỉ lấy giờ, phút và giây
  };

  // Combine date and time into a single order_time
  const getOrderTime = () => {
    if (!selectedDate || !orderTime) {
      return null;
    }

    const date = new Date(selectedDate);
    const [hours, minutes] = orderTime.split(":");
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10)); // Set hours and minutes

    return date.toISOString(); // Chuyển đổi thành ISO string để gửi yêu cầu
  };

  // Handle creating order
  const createOrder = async () => {
    const order_time = getOrderTime();
    if (!order_time || !slotService) {
      Alert.alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const orderData = {
      orderDate: selectedDate,
      customerId: userId,
      service_price: servicePrice,
      slot_service: slotService,
      order_time: order_time,
    };

    console.log("orderData:", orderData);

    try {
      const response = await axios.post(
        `http://192.168.1.12:9999/service-orders/create-order-id/${serviceId}`,
        orderData
      );
      console.log("Order created successfully:", response.data);
      Alert.alert("Đặt lịch thành công!");
      navigation.navigate("HomeScreen"); // Navigate back to home or other page
    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section with Image and Store Info */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/massage.png")}
          style={styles.image}
        />

        <Text style={styles.storeName}>{service.storeName}</Text>
        <Text style={styles.storeAddress}>{service.storeAddress}</Text>
      </View>

      {/* Price Section */}
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Giá dịch vụ:</Text>
        <Text style={styles.price}>{service.servicePrice} vnđ</Text>
      </View>

      {/* Slot Section */}
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>Số người</Text>
        <TextInput
          style={styles.timeInput}
          placeholder="Chọn số người"
          value={slotService.toString()}
          onChangeText={(text) => setSlotService(Number(text))}
          keyboardType="numeric" // Chỉ hiển thị bàn phím số
        />
      </View>

      {/* Date Section */}
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>Ngày</Text>
        <Calendar
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "blue" },
          }}
          onDayPress={onDayPress}
          monthFormat={"yyyy MM"}
          markingType={"simple"}
        />
      </View>

      {/* Time Section */}
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>Thời gian</Text>
        <TextInput
          style={styles.timeInput}
          placeholder="Chọn thời gian"
          value={orderTime}
          onFocus={() => setShowTimePicker(true)} // Show TimePicker when focusing
        />
      </View>

      {/* DateTimePicker for Time */}
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )}

      {/* Button Section */}
      <TouchableOpacity style={styles.button} onPress={createOrder}>
        <Text style={styles.buttonText}>Đặt lịch</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  storeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  storeAddress: {
    fontSize: 16,
    color: "#777",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 18,
    color: "#333",
  },
  price: {
    fontSize: 18,
    color: "#ff6b6b",
  },
  timeContainer: {
    marginBottom: 20,
  },
  timeLabel: {
    fontSize: 16,
    color: "#333",
  },
  timeInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#ff6b6b",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default CreateOrder;
