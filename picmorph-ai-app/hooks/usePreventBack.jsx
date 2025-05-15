import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { useNavigation } from "expo-router";

export const UsePreventBack = () => {
  const navigation = useNavigation();

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeft: () => null, // Убираем кнопку назад
      gestureEnabled: false, // Отключаем жесты
    });

    navigation.getParent()?.setOptions({ gestureEnabled: false });

    // Обработчик нажатия кнопки "Назад" на Android
    const hardwareBackPressHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true; // Блокируем действие по нажатию кнопки "Назад"
      }
    );

    return () => {
      navigation.getParent()?.setOptions({ gestureEnabled: true });
      navigation.setOptions({ gestureEnabled: true });
      hardwareBackPressHandler.remove();
    };
  });
};
