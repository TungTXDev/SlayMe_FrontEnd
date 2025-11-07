import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const ProductDetail = ({ route, navigation }) => {
  const { serviceId } = route.params; // lấy serviceId từ params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Để hiển thị trạng thái loading
  const [error, setError] = useState(null); // Để xử lý lỗi nếu có

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true); // Bắt đầu loading
        const response = await axios.get(
          `http://192.168.1.12:9999/store/get-service/${serviceId}`
        );

        if (response.status === 200) {
          setProduct(response.data); // Lưu sản phẩm vào state
        } else {
          setError("Service not found.");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("An error occurred while fetching the product.");
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchProduct();
  }, [serviceId]);

  const handleAddToCart = () => {
    // Đảm bảo rằng bạn đang điều hướng đúng
    if (product) {
      navigation.navigate("CreateOrder", { serviceId: product.serviceId });
    } else {
      Alert.alert("Error", "Unable to add product to cart");
    }
  };

  // Nếu đang loading hoặc có lỗi
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No product data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Hiển thị hình ảnh sản phẩm */}
        <Image
          source={{ uri: product.serviceImage[0] }}
          style={styles.productImage}
        />

        {/* Chi tiết sản phẩm */}
        <View style={styles.detailsContainer}>
          <Text style={styles.productTitle}>{product.serviceName}</Text>
          <Text style={styles.productPrice}>{product.servicePrice} VND</Text>
          <Text style={styles.productDescription}>
            Store: {product.storeNameName}
          </Text>
          <Text style={styles.productStock}>
            Address: {product.storeAddress}
          </Text>

          {/* Thêm vào giỏ hàng */}
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollView: {
    flexGrow: 1,
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
  },
  detailsContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 15,
  },
  productTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  productPrice: {
    fontSize: 22,
    color: "#007bff",
    marginBottom: 15,
    fontWeight: "600",
  },
  productStock: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  productDescription: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  addToCartButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProductDetail;
