import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = 'https://jpeople.nyc3.cdn.digitaloceanspaces.com/watchcon/windows/1.2.12.19/watchcon-1.2.12.19-install.exe';

  // Fetch file từ CDN
  const res = await fetch(url);

  // Kiểm tra lỗi nếu fetching không thành công
  if (!res.ok) {
    return new NextResponse('Failed to download file', { status: 500 });
  }

  // Đọc dữ liệu file
  const buffer = await res.arrayBuffer();

  // Lấy thời gian hiện tại
  const currentDate = new Date();

  // Định dạng ngày tháng giờ phút giây mili giây theo "yyyyMMddHHmmssSSS"
  const formattedDate = currentDate.toISOString()
    .replace(/T/, '') // Loại bỏ T
    .replace(/\..+/, '') // Loại bỏ phần sau dấu chấm (mili giây)
    .replace(/:/g, '')  // Loại bỏ dấu ":"
    .replace(/-/g, '');  // Loại bỏ dấu "-"

  // Tạo tên file với thời gian hiện tại, bao gồm mili giây
  const filename = `watchcon-1.2.12.19-${formattedDate}-install.exe`;

  // Trả về dữ liệu dưới dạng file với tên tùy chỉnh
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`, // Đổi tên file
    },
  });
}
