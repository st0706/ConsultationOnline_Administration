import { HumanName } from "fhir/r5";

//Tạo ngày tháng để fill vào form trường period trong FHIR
export const buildPeriod = (input) => {
  return input?.map((value) => {
    return {
      ...value,
      period: {
        start: value.period.start ? new Date(value.period.start).getTime() : undefined,
        end: value.period.end ? new Date(value.period.end).getTime() : undefined
      }
    };
  });
};
export const isValidRole = (userRole: string, requiredRole: string[]) => {
  return requiredRole.includes(userRole);
};
export const buildTime = (input) => {
  return input?.map((value) => {
    return {
      ...value,
      time: value.time ? new Date(value.time).getTime() : undefined
    };
  });
};

//Lấy tên chính thức từ danh sách tên FHIR
export const getOfficialName = (data?: HumanName[]) => {
  if (!data || data.length === 0) return "";
  const name = data.find((x) => x.use === "official") || data[0];
  const given = name && name.given && name.given.length > 0 ? (name.family ? " " : "") + name.given[0] : "";
  return `${name?.family}${given}`;
};

//Tạo địa chỉ chi tiết từ chuẩn FHIR
export const currentAddress = (data, use) => {
  const address = data?.find((value) => value?.use === use);
  return `${address?.line[1] ? address?.line[1] + "," : ""} ${address?.line[2] ? address?.line[2] + "," : ""} ${address?.district ? address?.district + "," : ""} ${address?.city ? address?.city : ""}`;
};

//Tìm định danh theo kiểu
export const findIdentifierByType = (data, type) => {
  return data?.find((identifier) => identifier?.type?.coding[0]?.code === type);
};

// Tạo đường dẫn (slug) từ tiêu đề cho tất cả các ký tự latin
export const slugify = (text: string) => {
  return text
    .toString()
    .normalize("NFD") // chuyển sang Unicode tổ hợp
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .replace(/đ/gi, "d") // xử lý riêng cho ký tự đ, Đ
    .toLowerCase() // chuyển thành chữ viết thường
    .replace(/([^0-9a-z-\s])/g, "") // xóa tất cả các ký tự đặc biệt
    .replace(/\s+/g, "-") // chuyển dấu cách thành dấu gạch ngang
    .replace(/&/g, "-va-") // chuyển ký tự '&' thành 'va'
    .replace(/[^\w\-]+/g, "") // loại bỏ những ký tự không phải chữ cái
    .replace(/\-\-+/g, "-") // gộp nhiều dấu gạch ngang
    .replace(/^-+/, "") // bỏ dấu gạch ngang ở đầu
    .replace(/-+$/, ""); // bỏ dấu gạch ngang ở cuối
};

export const domainRegex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;

export const validateDomain = (domain: string): boolean => {
  return domainRegex.test(domain);
};

export const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Password should be at least 8 characters long
  if (password.length < 8) {
    return false;
  }

  // Password should have at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Password should have at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Password should have at least one number
  if (!/\d/.test(password)) {
    return false;
  }

  // Password should have at least one special character
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return false;
  }

  return true;
};
export function buildFolderTree(fileList) {
  const root = {};

  fileList.forEach((file) => {
    const pathParts = file.webkitRelativePath.split("/"); // Tách đường dẫn thành các phần
    let currentLevel = root;

    pathParts.forEach((part, index) => {
      if (index === pathParts.length - 1) {
        // Đây là file, gán vào currentLevel
        currentLevel[part] = file;
      } else {
        // Đây là thư mục, tạo hoặc duyệt vào thư mục
        if (!currentLevel[part]) {
          currentLevel[part] = {};
        }
        currentLevel = currentLevel[part];
      }
    });
  });

  return root;
}
export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const defaultHeaders = {
  "Content-Type": "application/json"
};

export const passwordPolicies = {
  minLength: 8
};
