# Hướng dẫn sử dụng

## Chạy máy ảo android

1. Cài đặt môi trường
   - Ấn vào [Set up your environment](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=expo-go)
   - Chọn hệ điều hành phù hợp
   - Làm theo các bước trong docs để cài đặt môi trường (nên khởi động lại máy vài lần để máy cập nhật môi trường)

2. Các trường hợp lỗi máy ảo
   - Lõi **could not connect to TCP port**
     - Chạy hai câu lệnh sau:
       - `adb kill-server`
       - `adb devices`
     - Sau đó vào lại terminal và nhấn a

3. Trường hợp có lỗi sau khi thêm thư viện vào dự án
   - Xóa node_modules và chạy `npm install` lại
   - Chạy lệnh `npx expo start -c` để build lại bundle
   - Từ các lần sau có thể chạy `npm start` như bình thường

## Các tài liệu có sử dụng

- Trang icon sử dụng trong app [expo/vector-icons](https://icons.expo.fyi/Index)
- Getstream [Getstream](https://getstream.io/)
- Stream chat SDK [Chat Messaging React Native](https://getstream.io/chat/docs/sdk/react-native/)
- Supabase docs [Supabase](https://supabase.com/docs)
