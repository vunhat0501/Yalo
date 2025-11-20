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

## Local database supabase

1. Cài đặt Docker
   - [Docker](https://www.docker.com/products/docker-desktop/)
   - [Docker Docs](https://docs.docker.com/)

2. Cài đặt Deno (do supabase local sử dụng)
   - [Deno](https://docs.deno.com/runtime/getting_started/installation/)
   - Nếu như phải import thư viện của npm vào các phần chạy Deno (vd như thư mục của supabase):
     - Bước 1: thêm thư viện muốn sử dụng vào deno.json theo dạng `"lib": "npm:lib@^version"`
     - Bước 2: chạy lệnh theo cú pháp `deno cache --reload supabase/functions/stream-token/index.ts` (đường dẫn thay đổi tùy thuộc vào file import)
     - Bước 3: Xóa file deno.lock (do phiên bản của Deno hiện tại khác với supabase dùng)

3. CLI chạy supabase
   Note: Có thể tự tải [Supabase CLI](https://supabase.com/docs/reference/cli/introduction) hoặc chạy lệnh bằng npx.
   <!-- Hiện tại CLI của supabase v2.58 đang lỗi nên tạm thời dùng Beta (có thể xem ở Issue ở dưới) -->
   - Login: `npx supabase login`
   - Link: `npx supabase link --project-ref ref --debug` thay ref bằng id thực
   - Start db: `npx supabase start` (nhớ xóa file supabase/.temp/storage-migration trước khi chạy. Mỗi lần link lại supabase thì phải xóa file này nếu muốn chạy)
   - Pulling db: `npx supabase db pull` (chỉ chạy nếu database thay đổi và nên báo cho team leader trước khi pull)
   - Stop db: `npx supabase stop --no-backup`
   - Nếu trong quá trình chạy gặp lỗi dạng `failed to create docker container: Error response from daemon: Conflict. The container name "/supabase_vector_Yalo" is already in use by container "chuỗi rất dài". You have to remove (or rename) that container to be able to reuse that name.` thì có thể chạy lại lệnh stop ở trên và rồi start lại.
   - Nếu vẫn không được thì có thể kiểm tra bằng `docker ps -a --filter "name=supabase_" -q | ForEach-Object { docker rm -f $_ }` xem docker đã được dọn hay chưa

4. Lưu ý nên dọn Docker sau ghi hết dự án hoặc máy hết dung lượng
   - Check mức độ sử dụng: `docker  system df`
   - Xóa images: `docker images prune -a -f`
   - Xóa containers: `docker container prune -f`

## Lỗi có thể gặp khi chạy dự án

- Error: Migration iceberg-catalog-ids not found [Cli Issue #4466](https://github.com/supabase/cli/issues/4466)

## Các tài liệu có sử dụng

- Trang icon sử dụng trong app [expo/vector-icons](https://icons.expo.fyi/Index)
- Getstream [Getstream](https://getstream.io/)
- Stream chat SDK [Chat Messaging React Native](https://getstream.io/chat/docs/sdk/react-native/)
- Supabase docs [Supabase](https://supabase.com/docs)
