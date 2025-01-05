import { env } from "@/env";
import CryptoJS from "crypto-js";
import i18n from "i18next";

export const handleJoinRoom = async (room, user, notify, Variant) => {
  const roomInfo = {
    room_id: room.id,
    empty_timeout: 60 * 60 * 2,
    metadata: {
      room_title: room.title,
      welcome_message: "Welcome to plugNmeet!<br /> To share microphone click mic icon from bottom left side.",
      //webhook_url: "http://example.com",
      //logout_url: "http://example.com",
      room_features: {
        allow_webcams: true,
        mute_on_start: false,
        allow_screen_share: true,
        allow_rtmp: true,
        admin_only_webcams: false,
        allow_view_other_webcams: true,
        allow_view_other_users_list: true,
        allow_polls: true,
        room_duration: 0,
        enable_analytics: true,
        allow_virtual_bg: true,
        allow_raise_hand: true,
        recording_features: {
          is_allow: true,
          is_allow_cloud: true,
          is_allow_local: true,
          enable_auto_cloud_recording: false,
          only_record_admin_webcams: false
        },
        chat_features: {
          allow_chat: true,
          allow_file_upload: true,
          max_file_size: 50,
          allowed_file_types: ["jpg", "png", "zip"]
        },
        shared_note_pad_features: {
          allowed_shared_note_pad: true
        },
        whiteboard_features: {
          allowed_whiteboard: true
        },
        external_media_player_features: {
          allowed_external_media_player: true
        },
        waiting_room_features: {
          is_active: true
        },
        breakout_room_features: {
          is_allow: true,
          allowed_number_rooms: 6
        },
        display_external_link_features: {
          is_allow: true
        },
        ingress_features: {
          is_allow: true
        },
        speech_to_text_translation_features: {
          is_allow: true,
          is_allow_translation: true
        }
        // end_to_end_encryption_features: {
        //     is_enabled: true,
        //     included_chat_messages: true,
        //     // this may use more CPU for the user end.
        //     // do not enable it unless really necessary
        //     included_whiteboard: false,
        // }
      }
      // default_lock_settings: {
      //     lock_microphone: true,
      //     lock_screen_sharing: true,
      //     lock_webcam: true,
      //     lock_chat_file_share: true,
      //     lock_chat_send_message: true
      // }
    }
  };

  const userInfo = {
    is_admin: user.type === "admin",
    name: user.name,
    user_id: user.id
    /*user_metadata: {
            record_webcam: false,
            preferred_lang: "bn-BD",
        }*/
  };
  const res = await processRequest(roomInfo, userInfo, notify, Variant);
  return res;
};

const processRequest = async (roomInfo, userInfo, notify, Variant) => {
  // let's check if room is active or not
  const isRoomActiveReq = {
    room_id: roomInfo.room_id
  };

  const res = await sendRequest(isRoomActiveReq, "room/isRoomActive", notify, Variant);
  if (!res.status) {
    notify(i18n.t("errorNotify"), Variant?.Error);
  }
  let isRoomActive = res.is_active;

  // if not active then we'll create
  if (!isRoomActive) {
    const roomCreateRes = await sendRequest(roomInfo, "room/create", notify, Variant);
    if (!roomCreateRes.status) {
      notify(i18n.t("errorNotify"), Variant?.Error);
      return;
    }
    isRoomActive = roomCreateRes.status;
  }

  // if room active then we'll join
  if (isRoomActive) {
    const getJoinTokenReq = {
      room_id: roomInfo.room_id,
      user_info: userInfo
    };

    const roomJoinRes = await sendRequest(getJoinTokenReq, "room/getJoinToken", notify, Variant);

    if (roomJoinRes.status) {
      window.open("https://" + env.NEXT_PUBLIC_PLUG_N_MEET_SERVER_URL + "/?access_token=" + roomJoinRes.token);
    } else {
      notify(i18n.t("errorNotify"), Variant?.Error);
    }
    return roomJoinRes;
  }
};

export const sendRequest = async (body, method, notify?, Variant?) => {
  const API_SECRET = env.NEXT_PUBLIC_PLUGNMEET_API_SECRET;
  const API_KEY = env.NEXT_PUBLIC_PLUGNMEET_API_KEY;
  const b = JSON.stringify(body);
  const hash = CryptoJS.HmacSHA256(b, API_SECRET as string);
  const signature = CryptoJS.enc.Hex.stringify(hash);

  let headers = {
    "Content-Type": "application/json",
    "API-KEY": API_KEY as string,
    "HASH-SIGNATURE": signature
  };
  const response = await fetch(`https://${env.NEXT_PUBLIC_PLUG_N_MEET_SERVER_URL}/auth/${method}`, {
    method: "POST",
    headers: headers,
    body: b
  });

  if (response.status !== 200) {
    // notify(i18n.t("errorNotify"), Variant?.Error);
    console.log(await response.json());
    return;
  }
  return await response.json();
};
