import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { useSelector } from "react-redux";
import SLAYME from "../../assets/SLAYME.svg";

const HomeScreen = ({ navigation }) => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [filterPrice, setFilterPrice] = useState("lowToHigh");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterSearch, setFilterSearch] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const role = useSelector((state) => state.auth.user?.role);

  useEffect(() => {
    getAllStore();
  }, []);

  const getAllStore = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.12:9999/store/listStore"
      );
      setStores(response.data || []);
      setFilteredStores(response.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    let filtered = stores;

    if (filterSearch.trim()) {
      filtered = filtered
        .map((store) => {
          const matchingServices =
            store.services?.filter((service) =>
              service.service_name
                .toLowerCase()
                .includes(filterSearch.toLowerCase())
            ) || [];

          return matchingServices.length > 0
            ? { ...store, services: matchingServices }
            : null;
        })
        .filter(Boolean);
    }

    if (filterLocation !== "All") {
      filtered = filtered.filter((store) =>
        store.address?.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    filtered.forEach((store) => {
      store.services?.sort((a, b) =>
        filterPrice === "lowToHigh"
          ? a.service_price - b.service_price
          : b.service_price - a.service_price
      );
    });

    setFilteredStores(filtered);
  }, [filterSearch, filterPrice, filterLocation, stores]);

  const openServiceDetail = (serviceId) => {
    navigation.navigate("ProductDetail", { serviceId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.viewImage}>
          <SLAYME width={150} height={35} />
        </View>
        <View style={styles.cartContainer}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#888"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm dịch vụ..."
              placeholderTextColor="#8A8A8A"
              value={filterSearch}
              onChangeText={setFilterSearch}
            />
          </View>

          {/* Các biểu tượng */}
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation.navigate("RequestOrder")}
            >
              <FontAwesome name="plus" size={28} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() =>
                navigation.navigate(
                  role === 1 ? "Notification" : "SupplierNotification"
                )
              }
            >
              <FontAwesome name="bell" size={28} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation.navigate("Cart")}
            >
              <FontAwesome name="cart-plus" size={28} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bộ lọc giá */}
        <View style={styles.filters}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterPrice === "lowToHigh" && styles.selectedFilter,
            ]}
            onPress={() => setFilterPrice("lowToHigh")}
          >
            <Text style={styles.filterText}>Giá: Tăng dần</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterPrice === "highToLow" && styles.selectedFilter,
            ]}
            onPress={() => setFilterPrice("highToLow")}
          >
            <Text style={styles.filterText}>Giá: Giảm dần</Text>
          </TouchableOpacity>
        </View>

        {/* Hiển thị dịch vụ */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Dịch vụ</Text>

          {/* Hiển thị các dịch vụ */}
          <View style={styles.productRow}>
            {filteredStores.map((store) =>
              store.services?.map((service) => (
                <TouchableOpacity
                  style={styles.productContainer}
                  key={service._id}
                  onPress={() => openServiceDetail(service._id)} // mở chi tiết dịch vụ khi nhấn vào sản phẩm
                >
                  <Image
                    source={{ uri: store.image[0] }}
                    style={styles.productImage}
                  />
                  <View style={styles.productDetails}>
                    <Text style={styles.productTitle}>
                      {service.service_name}
                    </Text>
                    <Text style={styles.productPrice}>
                      Cửa hàng: {store.nameShop}
                    </Text>
                    <Text style={styles.productPrice}>
                      Gía: {service.service_price} VND
                    </Text>
                    <Text style={styles.productStock}>
                      Địa chỉ: {store.address}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        {/* Blog trending */}
        <View style={styles.blogSection}>
          <Text style={styles.sectionTitle}>Trending</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {blogsTrending.map((item, index) => (
              <View key={index} style={styles.blogCard}>
                <Image source={item.image} style={styles.blogImage} />
                <Text style={styles.blogText}>{item.title}</Text>
                <TouchableOpacity
                  style={styles.linkContainerFB}
                  onPress={() =>
                    Linking.openURL(
                      "https://www.facebook.com/share/p/1B4AYbq8vd/"
                    )
                  }
                >
                  <Text style={styles.linkText}>Xem trên Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.linkContainer}
                  onPress={() =>
                    Linking.openURL(
                      "https://www.tiktok.com/@koremaz_/video/7427051084713102600"
                    )
                  }
                >
                  <Text style={styles.linkText}>Xem TikTok của tôi</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Mẹo chăm sóc</Text>

          <View style={styles.tipContainer}>
            <Text style={styles.tipTitle}>
              Mẹo để tóc đẹp mà không phải ai cũng biết
            </Text>
            <Image
              source={{
                uri: "https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-Viet-Nam-ngau.jpg",
              }}
              style={styles.tipImage}
            />
            <Text style={styles.tipText}>
              Tóc đẹp không chỉ nhờ vào sản phẩm bạn dùng, mà còn nhờ vào chế độ
              chăm sóc hợp lý. Hãy đảm bảo rằng bạn đang sử dụng các loại dầu
              gội và dầu xả phù hợp với loại tóc của mình. Ngoài ra, một chế độ
              ăn uống lành mạnh và uống đủ nước sẽ giúp tóc bạn chắc khỏe hơn
              mỗi ngày.
            </Text>
          </View>

          <View style={styles.tipContainer}>
            <Text style={styles.tipTitle}>Chăm sóc da mùa đông</Text>
            <Image
              source={{
                uri: "https://anhnail.com/wp-content/uploads/2024/10/Hinh-anh-gai-xinh-k9-toc-dai.jpg",
              }}
              style={styles.tipImage}
            />
            <Text style={styles.tipText}>
              Vào mùa đông, da dễ bị khô và thiếu ẩm. Bạn nên sử dụng các loại
              kem dưỡng ẩm sâu và đừng quên bảo vệ da khỏi gió lạnh. Ngoài ra,
              việc uống nhiều nước cũng rất quan trọng để duy trì làn da mềm
              mại, mịn màng.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const blogsTrending = [
  {
    title: "Xu hướng Mẫu Tóc Xuân 2025",
    image: require("../../assets/demo.jpg"),
  },
  {
    title: "Xu hướng Mẫu Tóc Noel 2024",
    image: require("../../assets/NganKhanh.png"),
  },
  {
    title: "Xu hướng Mẫu Tóc Thu 2024",
    image: require("../../assets/ThuHang.png"),
  },
  {
    title: "Xu hướng Mẫu Tóc Đôn chề",
    image: require("../../assets/KhaBanh.png"),
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  cartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
    width: "60%",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFF",
    borderColor: "#DDD",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "40%",
  },
  cartButton: {
    padding: 8,
  },
  scrollView: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  categorySection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  productRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productContainer: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    resizeMode: "cover",
  },
  productDetails: {
    flex: 1,
    marginTop: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "#007bff",
    marginVertical: 5,
  },
  productStock: {
    fontSize: 14,
    color: "#888",
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filterButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 5,
  },
  selectedFilter: {
    backgroundColor: "#F6C7F5",
  },
  blogSection: {
    marginTop: 30,
  },
  blogCard: {
    width: 200,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
  },
  blogImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  blogText: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
  },
  linkContainerFB: {
    backgroundColor: "#1877f2",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    width: "100%",
    marginBottom: 8,
    alignItems: "center",
  },
  linkContainer: {
    backgroundColor: "#ff0050",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    width: "100%",
    marginBottom: 8,
    alignItems: "center",
  },
  linkText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  viewImage: {
    alignItems: "center",
    marginBottom: 10,
  },
  tipsSection: {
    marginTop: 30,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tipContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tipImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});

export default HomeScreen;
