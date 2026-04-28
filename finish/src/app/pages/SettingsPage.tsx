import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  User,
  Lock,
  AlertTriangle,
  ChevronRight,
  Check,
  X,
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

type ActivePanel = null | "profile" | "nickname" | "password" | "withdraw";

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  // Form states
  const [nickname, setNickname] = useState(user?.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [withdrawConfirm, setWithdrawConfirm] = useState("");

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setProfileImageFile(file); setProfileImageUrl(URL.createObjectURL(file)); }
  };

  const handleSaveProfileImage = () => {
    if (!profileImageFile) { toast.error("이미지를 선택해주세요"); return; }
    toast.success("프로필 사진이 변경되었습니다");
    setActivePanel(null);
  };

  const handleSaveNickname = () => {
    if (!nickname.trim()) {
      toast.error("닉네임을 입력해주세요");
      return;
    }
    updateUser({ name: nickname });
    toast.success("닉네임이 변경되었습니다");
    setActivePanel(null);
  };

  const handleSavePassword = () => {
    if (!oldPassword) {
      toast.error("현재 비밀번호를 입력해주세요");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("비밀번호는 8자 이상이어야 합니다");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다");
      return;
    }
    toast.success("비밀번호가 변경되었습니다");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setActivePanel(null);
  };

  const handleWithdraw = () => {
    if (withdrawConfirm !== "탈퇴하겠습니다") {
      toast.error("탈퇴 확인 문구를 정확히 입력해주세요");
      return;
    }
    logout();
    toast.success("회원 탈퇴가 완료되었습니다");
    navigate("/");
  };

  const settingGroups = [
    {
      title: "계정 설정",
      items: [
        {
          key: "profile" as ActivePanel,
          icon: <Camera className="w-4 h-4 text-gray-500" />,
          label: "프로필 사진 설정",
          value: "",
        },
        {
          key: "nickname" as ActivePanel,
          icon: <User className="w-4 h-4 text-gray-500" />,
          label: "닉네임 변경",
          value: user?.name || "",
        },
        {
          key: "password" as ActivePanel,
          icon: <Lock className="w-4 h-4 text-gray-500" />,
          label: "비밀번호 변경",
          value: "••••••••",
        },
      ],
    },
    {
      title: "계정 관리",
      items: [
        {
          key: "withdraw" as ActivePanel,
          icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
          label: "회원 탈퇴",
          value: "",
          danger: true,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => (activePanel ? setActivePanel(null) : navigate(-1))}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            {activePanel ? panelTitle(activePanel) : "설정"}
          </h1>
        </div>
      </div>

      <div className="pt-[72px]">
        {/* Main Settings List */}
        {!activePanel && (
          <div className="px-5 py-5 space-y-6">
            {settingGroups.map((group, gIdx) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gIdx * 0.05 }}
              >
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
                  {group.title}
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {group.items.map((item, iIdx) => (
                    <button
                      key={item.label}
                      onClick={() => setActivePanel(item.key)}
                      className={`w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors ${
                        iIdx < group.items.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.icon}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            item.danger ? "text-red-500" : "text-gray-900"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.value && (
                          <span className="text-xs text-gray-400 max-w-[120px] truncate">
                            {item.value}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Profile Image Panel */}
        {activePanel === "profile" && (
          <Panel>
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="프로필" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-10 h-10 text-gray-300" />
                )}
              </div>
              <p className="text-xs text-gray-400">현재 프로필 사진</p>
            </div>
            <FieldLabel>새 프로필 사진 선택</FieldLabel>
            <div className="mt-2">
              <input id="profile-upload" type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" />
              <label
                htmlFor="profile-upload"
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-4 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors text-sm text-gray-400 hover:text-gray-600"
              >
                <Camera className="w-4 h-4" />
                {profileImageFile ? profileImageFile.name : "사진을 선택하세요"}
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-2">JPG, PNG 형식, 최대 5MB</p>
            <SaveBtn onClick={handleSaveProfileImage} />
          </Panel>
        )}

        {/* Nickname Panel */}
        {activePanel === "nickname" && (
          <Panel>
            <FieldLabel>새 닉네임</FieldLabel>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 mt-2"
            />
            <p className="text-xs text-gray-400 mt-2">2~12자 이내, 특수문자 불가</p>
            <SaveBtn onClick={handleSaveNickname} />
          </Panel>
        )}

        {/* Password Panel */}
        {activePanel === "password" && (
          <Panel>
            <div className="space-y-4">
              <div>
                <FieldLabel>현재 비밀번호</FieldLabel>
                <div className="relative mt-2">
                  <input
                    type={showOld ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="현재 비밀번호"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 pr-10"
                  />
                  <button
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <FieldLabel>새 비밀번호</FieldLabel>
                <div className="relative mt-2">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호 (8자 이상)"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 pr-10"
                  />
                  <button
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <FieldLabel>새 비밀번호 확인</FieldLabel>
                <div className="relative mt-2">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="새 비밀번호 재입력"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                  {confirmPassword && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {confirmPassword === newPassword ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <SaveBtn onClick={handleSavePassword} />
          </Panel>
        )}

        {/* Withdraw Panel */}
        {activePanel === "withdraw" && (
          <Panel>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-bold text-red-600">회원 탈퇴 유의사항</span>
              </div>
              <ul className="space-y-1.5">
                {[
                  "탈퇴 시 모든 데이터(아카이브, 게시글 등)가 삭제됩니다",
                  "진행 중인 펀딩이 있을 경우 탈퇴가 제한될 수 있습니다",
                  "탈퇴 후 동일 이메일로 재가입이 30일간 제한됩니다",
                  "삭제된 데이터는 복구할 수 없습니다",
                ].map((text) => (
                  <li key={text} className="flex gap-1.5 text-xs text-red-600">
                    <span>•</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <FieldLabel>확인 문구 입력</FieldLabel>
            <p className="text-xs text-gray-500 mt-1 mb-2">
              아래 입력란에 <strong>"탈퇴하겠습니다"</strong>를 입력해주세요
            </p>
            <input
              type="text"
              value={withdrawConfirm}
              onChange={(e) => setWithdrawConfirm(e.target.value)}
              placeholder="탈퇴하겠습니다"
              className="w-full border border-red-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <button
              onClick={handleWithdraw}
              className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
            >
              회원 탈퇴하기
            </button>
          </Panel>
        )}
      </div>
    </div>
  );
}

function panelTitle(panel: ActivePanel): string {
  const map: Record<string, string> = {
    profile: "프로필 사진 설정",
    nickname: "닉네임 변경",
    password: "비밀번호 변경",
    withdraw: "회원 탈퇴",
  };
  return panel ? map[panel] || "설정" : "설정";
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="px-5 py-5"
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        {children}
      </div>
    </motion.div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-semibold text-gray-900">{children}</label>;
}

function SaveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full mt-5 bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-colors text-sm"
    >
      저장하기
    </button>
  );
}