import { useState } from "react";
import { Text, View, Image, Alert } from "react-native";
import InputBox from "../components/InputBox";
import SubmitButton from "../components/SubmitButton";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LOCALHOST } from "@env";

export default function App() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [hidepassword, setHidePassword] = useState(true);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!form.email || !form.password) {
      Alert.alert(
        "Validation Error",
        "Please fill in all fields before signing in."
      );
      return;
    }

    try {
      const response = await axios.post(`http://${LOCALHOST}:4000/auth/login`, {
        email: form.email,
        password: form.password,
      });

      const { token, userId, username } = response.data;

      // Simpan token, userId, dan username ke AsyncStorage
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userId", userId.toString());
      await AsyncStorage.setItem("username", username);

      Alert.alert("Success", "Next, let's play the game!");
      router.replace("/main-menu");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Login Error",
        error.response?.data?.message || "An error occurred during login."
      );
    }
  };

  return (
    <>
      <Image source={require("../assets/images/logo.png")} />

      <View style={{ width: "100%", paddingHorizontal: 20 }}>
        <InputBox
          text="Email"
          keyboardType="email-address"
          form={form}
          setForm={setForm}
          LowerCase={true}
        />
        <InputBox
          text="Password"
          secureTextEntry={hidepassword}
          password={true}
          setPasswordVisible={setHidePassword}
          PasswordVisible={hidepassword}
          form={form}
          setForm={setForm}
        />

        <Text style={{ color: "#fff", alignSelf: "flex-start" }}>
          Don't have an account?{" "}
          <Link href={"/register"}>
            <Text style={{ color: "#FEBB24", fontWeight: "bold" }}>
              Register here
            </Text>
          </Link>
        </Text>
      </View>
      <SubmitButton text="Sign In" onPress={handleSignIn} />
    </>
  );
}
