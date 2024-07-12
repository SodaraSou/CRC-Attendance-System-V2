"use server";

import { google } from "googleapis";

export async function getSheetData() {
  const glAuth = await google.auth.getClient({
    projectId: "crc-attendance-system-426802",
    credentials: {
      type: "service_account",
      project_id: "crc-attendance-system-426802",
      private_key_id: "39a4f5493ce9ff3e5700f2be8d00dabc18d3d576",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDGW/tJWtlLV41d\noxn4MRfNi9VBnOcnEEtkUlIi4l/KTyIRlfRWVUT+IMuuBzH7ZhRnQVNfC8JIltWH\n2D8kO83mCWUnwpPMAWADR/yR+zo9+W88Lbkuhpjc+cy1KJ8JQvR+rYOI6sNWADUs\nkrcesWMyLGzTRJfKPNPg/u/C6YQp9alqVR5MWuuEBr3c989apsl54PYR8IdlfKoQ\nFq2Yht7HxHIc9s7orBNiG0EVQzuvlQDtDmrDivdpK4Yy1EujVeEEkmrrmBqHMIdA\nJYyY9L9wiGZWcceUxv0rhh5uNafMU8MBg3jpbFS5p9cVIrs/e70Es2e931v+isbJ\nAuzC6yKdAgMBAAECggEAG6ZStCT1HoAedSujwRRGzHYYzJlBzLuEEYCQG8tmWDMI\n/V6OZ+0MPZ2gsVTQw3Rf6mIRbFxH7ApqdWclVg2oDnrHc5q3M2a1qtTBVi/+LF61\nV17K7hCrr5HP1n4fvRDCOAOZJDVlSSWk7oj8/Er0bYKtIL3yUqnWobRSWN8SzIOd\nEcUjSJKVocxxlu4F5HiPPGvM0LgGSr7m5T7K1AMmnugRidF8qfnRgmgtnpyprVwi\nTF/KqBYVYbhhA6wWA0t+xSN9Npp4Zav/d1dretP0GuCJ2XNVpmQ56oVChQs1asNo\n6QesANiD5oFmAjjW0OP8EvWisTYQGynB5da4keqgGQKBgQDlAT893ru+HzOaRL21\naTNSJ3eulrrS5nq7QruW19mlI6wwcG8zSaM8uZYiM9BjARakN48rDIn8uJP42yId\nDPNpT9bxL0gMirMT9Lu/EbiN4AYn/5JlXbnI/FjH6YFmpVlMSBZA5/B0CeAH17m/\nYrVsTN4E3vtUxraB5WR0qg5XXwKBgQDdve74Rky/FZeUQ9BM8zHJy1kyWyWESyZt\nzG4y0/A9E66UFWaQhT1jB2CiRJrfuV8w/1g7B3JWjg48umZXeyj2Y8th/PYg7Qdn\nbmrTdlM4ml+fv3CuLxPrtuNKYp30M6PrRO2ESesW8rNWmhYstG+3N/tW1ZpwqZtL\n5/3xC6OzgwKBgQDMYzyKf8yYd0ibG1cmHmqLnGYZELZVnRdVIs5CZwv9c8Uuxmq5\nH7PtcsYoaI5IjqQilOPWzC4rvKF0rj/YJcLp7zQrtsNbTj9eREN82Nga6CMWd+e1\nSN2UIIUsh5/SeSkmCAC0lU3qgxXMaiGCSxsZOdG+DzXKCEDD1nS+GzkJiQKBgFnw\nbfs52GsxANhcYSK1CZ7F4hnwqljselvSrWfkWu8LCqZ5v64ivPFrzqBCn2bbM2cW\nSt02egPtfozXNieJhuXZOGc4SUS1n2kuehnnRn4Q73RGHBgqdDQJbEuBkHu6bmRB\nAu3DZZ1bN66KtS/Qx/dSt5lS7l+AC8NQB8o7ZFytAoGAZReKOqEbFbRzztxE0Uuo\n83ei9oGGOtkTvFyBxVtzR+nCxai+PCrKD/dDFMH//iPeSczALWx3F9fox1TyZauR\niRQk9wK/Veoeh8ADNbRKVDJhNsqy0N4HH1H3fpBP9D4SzplxcwC90/mZ9SJofqdE\nDvaITj3A6mGdZ+QUVMKBgn4=\n-----END PRIVATE KEY-----\n",
      client_email:
        "sodara-sou@crc-attendance-system-426802.iam.gserviceaccount.com",
      universe_domain: "googleapis.com",
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const glSheets = google.sheets({ version: "v4", auth: glAuth });

  const data = await glSheets.spreadsheets.values.get({
    spreadsheetId: "1o1dfZ6LGnO_J7zap1gm3G1a22EkREA7OAuaSlagrzfc",
    range: "Sheet1!A1:D5",
  });

  const convertToObjects = (data: any) => {
    const headers = data[0];
    return data.slice(1).map((row: any) => {
      return row.reduce((obj: any, value: any, index: any) => {
        obj[headers[index]] = value;
        return obj;
      }, {});
    });
  };

  const result = convertToObjects(data.data.values);

  return { data: result };
}

interface AttendanceInput {
  name: string;
  phone: string;
  time: string;
  profileImg: string;
  checkInStatus: string;
  role: string;
}

export async function postSheetData(input: AttendanceInput) {
  const glAuth = await google.auth.getClient({
    projectId: "crc-attendance-system-426802",
    credentials: {
      type: "service_account",
      project_id: "crc-attendance-system-426802",
      private_key_id: "39a4f5493ce9ff3e5700f2be8d00dabc18d3d576",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDGW/tJWtlLV41d\noxn4MRfNi9VBnOcnEEtkUlIi4l/KTyIRlfRWVUT+IMuuBzH7ZhRnQVNfC8JIltWH\n2D8kO83mCWUnwpPMAWADR/yR+zo9+W88Lbkuhpjc+cy1KJ8JQvR+rYOI6sNWADUs\nkrcesWMyLGzTRJfKPNPg/u/C6YQp9alqVR5MWuuEBr3c989apsl54PYR8IdlfKoQ\nFq2Yht7HxHIc9s7orBNiG0EVQzuvlQDtDmrDivdpK4Yy1EujVeEEkmrrmBqHMIdA\nJYyY9L9wiGZWcceUxv0rhh5uNafMU8MBg3jpbFS5p9cVIrs/e70Es2e931v+isbJ\nAuzC6yKdAgMBAAECggEAG6ZStCT1HoAedSujwRRGzHYYzJlBzLuEEYCQG8tmWDMI\n/V6OZ+0MPZ2gsVTQw3Rf6mIRbFxH7ApqdWclVg2oDnrHc5q3M2a1qtTBVi/+LF61\nV17K7hCrr5HP1n4fvRDCOAOZJDVlSSWk7oj8/Er0bYKtIL3yUqnWobRSWN8SzIOd\nEcUjSJKVocxxlu4F5HiPPGvM0LgGSr7m5T7K1AMmnugRidF8qfnRgmgtnpyprVwi\nTF/KqBYVYbhhA6wWA0t+xSN9Npp4Zav/d1dretP0GuCJ2XNVpmQ56oVChQs1asNo\n6QesANiD5oFmAjjW0OP8EvWisTYQGynB5da4keqgGQKBgQDlAT893ru+HzOaRL21\naTNSJ3eulrrS5nq7QruW19mlI6wwcG8zSaM8uZYiM9BjARakN48rDIn8uJP42yId\nDPNpT9bxL0gMirMT9Lu/EbiN4AYn/5JlXbnI/FjH6YFmpVlMSBZA5/B0CeAH17m/\nYrVsTN4E3vtUxraB5WR0qg5XXwKBgQDdve74Rky/FZeUQ9BM8zHJy1kyWyWESyZt\nzG4y0/A9E66UFWaQhT1jB2CiRJrfuV8w/1g7B3JWjg48umZXeyj2Y8th/PYg7Qdn\nbmrTdlM4ml+fv3CuLxPrtuNKYp30M6PrRO2ESesW8rNWmhYstG+3N/tW1ZpwqZtL\n5/3xC6OzgwKBgQDMYzyKf8yYd0ibG1cmHmqLnGYZELZVnRdVIs5CZwv9c8Uuxmq5\nH7PtcsYoaI5IjqQilOPWzC4rvKF0rj/YJcLp7zQrtsNbTj9eREN82Nga6CMWd+e1\nSN2UIIUsh5/SeSkmCAC0lU3qgxXMaiGCSxsZOdG+DzXKCEDD1nS+GzkJiQKBgFnw\nbfs52GsxANhcYSK1CZ7F4hnwqljselvSrWfkWu8LCqZ5v64ivPFrzqBCn2bbM2cW\nSt02egPtfozXNieJhuXZOGc4SUS1n2kuehnnRn4Q73RGHBgqdDQJbEuBkHu6bmRB\nAu3DZZ1bN66KtS/Qx/dSt5lS7l+AC8NQB8o7ZFytAoGAZReKOqEbFbRzztxE0Uuo\n83ei9oGGOtkTvFyBxVtzR+nCxai+PCrKD/dDFMH//iPeSczALWx3F9fox1TyZauR\niRQk9wK/Veoeh8ADNbRKVDJhNsqy0N4HH1H3fpBP9D4SzplxcwC90/mZ9SJofqdE\nDvaITj3A6mGdZ+QUVMKBgn4=\n-----END PRIVATE KEY-----\n",
      client_email:
        "sodara-sou@crc-attendance-system-426802.iam.gserviceaccount.com",
      universe_domain: "googleapis.com",
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const glSheets = google.sheets({ version: "v4", auth: glAuth });

  const profileImgFormula = input.profileImg
    ? `=IMAGE("${input.profileImg}")`
    : "";
  await glSheets.spreadsheets.values.append({
    auth: glAuth,
    spreadsheetId: "1eAK6uLrnmVrw6N-eMwwMRIqA6Yeq8dNUV_LevFD81dE",
    range: "A:A",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          profileImgFormula,
          input.name,
          input.phone,
          input.checkInStatus,
          input.time,
          input.role,
        ],
      ],
    },
  });
}
