import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  ScrollView,
  TextInput,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function RequestOrder({ navigation }) {
  const [selectedValue, setSelectedValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  const [selectedDate, setSelectedDate] = useState(null); // Lưu trữ ngày đã chọn
  const [selectedTime, setSelectedTime] = useState(null); // Lưu trữ giờ đã chọn
  const [showTimePicker, setShowTimePicker] = useState(false); // Trạng thái hiển thị time picker

  const userName = useSelector((state) => state.auth.user?.name);
  const userId = useSelector((state) => state.auth.user?.id);

  const dispatch = useDispatch();

  // Hàm lấy danh sách cửa hàng
  const getAllStore = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.12:9999/store/listStore"
      );
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
  };

  const getServicesForStore = (storeId) => {
    const store = stores.find((s) => s._id === storeId); // Tìm cửa hàng theo ID
    if (store) {
      setServices(store.services); // Cập nhật dịch vụ của cửa hàng đã chọn
    }
  };

  useEffect(() => {
    if (stores.length > 0) {
      setSelectedStore(stores[0]._id);
    }
    getAllStore();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      getServicesForStore(selectedStore);
    }
  }, [selectedStore]);

  // Hàm xử lý khi người dùng chọn ngày
  const onDayPress = (day) => {
    setSelectedDate(day.dateString); // Lưu ngày đã chọn
    setShowTimePicker(true); // Hiển thị bộ chọn thời gian
  };

  // Hàm xử lý khi người dùng chọn thời gian
  const onTimeChange = (event, selectedDateTime) => {
    setShowTimePicker(false);
    if (selectedDateTime) {
      const time = selectedDateTime.toLocaleTimeString(); // Lấy thời gian
      setSelectedTime(time); // Lưu thời gian đã chọn
    }
  };

  const createOrder = async () => {
    const selectedServiceDetails = services.find(
      (service) => service._id === selectedService
    );

    if (!selectedServiceDetails) {
      console.error("Service not found");
      return;
    }

    const orderData = {
      storeId: selectedStore,
      services: [
        {
          serviceId: selectedService,
          service_name: selectedServiceDetails.service_name, // Tên dịch vụ
          service_price: selectedServiceDetails.service_price, // Giá dịch vụ
          slot_service: selectedServiceDetails.slot_service, // Thời gian dịch vụ
        },
      ],
      orderDate: selectedDate + " " + selectedTime, // Định dạng ngày và giờ
    };

    try {
      const response = await axios.post(
        `http://192.168.1.12:9999/service-orders/create-order/${userId}`,
        orderData
      );
      console.log("Order created successfully:", response.data);
      // alert(response.data.message);
      alert("Đặt lịch thành công!");
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Có lỗi xảy ra khi tạo đơn hàng!");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>1. Chọn salon</Text>

      {/* Salon List */}
      <TouchableOpacity style={styles.listItem}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a service"
          placeholderTextColor="#8A8A8A"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Picker
          selectedValue={selectedStore}
          onValueChange={(itemValue) => setSelectedStore(itemValue)}
          style={styles.picker}
        >
          {stores.map((store, index) => (
            <Picker.Item key={index} label={store.nameShop} value={store._id} />
          ))}
        </Picker>
      </TouchableOpacity>

      {/* Title */}

      {/* Service List */}
      <TouchableOpacity style={styles.listItem}>
        <Text style={styles.title}>2. Chọn dịch vụ</Text>
        <Picker
          selectedValue={selectedService}
          onValueChange={(itemValue) => setSelectedService(itemValue)}
          style={styles.picker}
        >
          {services.map((service) => (
            <Picker.Item
              key={service._id}
              label={service.service_name}
              value={service._id}
            />
          ))}
        </Picker>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>3. Chọn ngày, giờ & stylist</Text>

      {/* Date and Time Selection */}
      <View style={styles.dateTimeContainer}>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={onDayPress}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "blue" },
            }}
          />
        </View>
        {/* Hiển thị nút chọn giờ */}
        {selectedDate && !selectedTime && (
          <Text style={styles.infoText}>Đã chọn ngày: {selectedDate}</Text>
        )}
        {selectedDate && !selectedTime && (
          <TouchableOpacity
            style={styles.normalDayButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text>Chọn giờ</Text>
          </TouchableOpacity>
        )}

        {/* Hiển thị bộ chọn thời gian */}
        {showTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
        )}

        {/* Hiển thị ngày và giờ đã chọn */}
        {selectedDate && selectedTime && (
          <Text style={styles.selectedText}>
            Bạn đã chọn: {selectedDate}, {selectedTime}
          </Text>
        )}

        <TouchableOpacity style={styles.normalDayButton}>
          <Text>Hôm nay, T4 (19/02)</Text>
        </TouchableOpacity>
      </View>

      {/* Book Button */}
      <Button
        title="Đặt lịch"
        onPress={createOrder}
        style={styles.bookButton}
      />

      {/* Note */}
      <Text style={styles.note}>Đến nơi thanh toán, huỷ lịch không sao</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    // marginBottom: 20, // Đảm bảo có khoảng cách giữa các phần tử
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  picker: {
    marginTop: -70,
    width: "100%", // Đảm bảo Picker chiếm toàn bộ chiều rộng
  },
  dateTimeContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  calendarContainer: {
    marginBottom: 15,
  },
  normalDayButton: {
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  note: {
    fontSize: 12,
    marginTop: 20,
    textAlign: "center",
  },
  bookButton: {
    backgroundColor: "green",
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
});
