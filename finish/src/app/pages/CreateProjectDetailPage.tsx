import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Eye,
  Upload,
  Plus,
  Trash2,
  AlertCircle,
  Calendar,
  DollarSign,
  Package,
  FileText,
  User,
  Shield,
  FileCheck,
  Image as ImageIcon,
  Video,
  Tag,
  ChevronLeft,
  Target,
  Clock,
  GripVertical,
} from "lucide-react";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

// 프로젝트 생성 탭
const projectTabs = [
  { id: "basic", label: "기본정보" },
  { id: "funding", label: "목표 금액 및 일정" },
  { id: "rewards", label: "법적 고시 정보" },
  { id: "taste", label: "맛 지표" },
  { id: "plan", label: "프로젝트 계획" },
  { id: "creator", label: "양조장 정보" },
  { id: "trust", label: "안내 사항" },
  { id: "verification", label: "인증 서류" },
];

export function CreateProjectDetailPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showFundingGuideModal, setShowFundingGuideModal] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
  const [showTempSaveModal, setShowTempSaveModal] = useState(false);
  const [tempSaveTimestamp, setTempSaveTimestamp] = useState<string>("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // 인증 상태
  const [phoneVerificationSent, setPhoneVerificationSent] = useState(false);
  const [phoneVerificationCode, setPhoneVerificationCode] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [accountVerified, setAccountVerified] = useState(false);

  // 파일 업로드 참조
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const idCardInputRef = useRef<HTMLInputElement>(null);
  const businessLicenseInputRef = useRef<HTMLInputElement>(null);
  const salesPermitInputRef = useRef<HTMLInputElement>(null);
  const alcoholPermitInputRef = useRef<HTMLInputElement>(null);
  const manufacturingLicenseInputRef = useRef<HTMLInputElement>(null);

  // 파일 이름 상태
  const [uploadedFiles, setUploadedFiles] = useState({
    profileImage: "",
    idCard: "",
    businessLicense: "",
    salesPermit: "",
    alcoholPermit: "",
    manufacturingLicense: "",
  });

  // 기본 정보 상태
  const [basicInfo, setBasicInfo] = useState({
    category: "",
    title: "",
    shortTitle: "",
    mainIngredient: "",
    subIngredient: "",
    alcoholContent: "",
    summary: "",
    images: [] as string[],
    videoUrl: "",
    projectUrl: "",
    tags: [] as string[],
    adultOnly: true,
  });

  // 펀딩 정보 상태
  const [fundingInfo, setFundingInfo] = useState({
    pricePerBottle: "",
    bottleQuantity: "",
    goalAmount: "",
    startDate: "",
    duration: 30,
    expectedDeliveryDate: "",
  });

  // 제품 정보 상태
  const [productInfo, setProductInfo] = useState({
    productType: "막걸리", // 고정값
    volume: "",
    alcoholContent: "",
    ingredients: [
      { id: 1, ingredient: "", origin: "" }
    ]
  });

  // 프로젝트 계획 상태
  const [projectPlan, setProjectPlan] = useState({
    introduction: "",
    rewardDetails: "",
    budget: "",
    schedule: "",
    team: "",
  });

  // 양조장 정보 상태
  const [creatorInfo, setCreatorInfo] = useState({
    name: "",
    profileImage: "",
    bio: "",
    phone: "",
    accountBank: "",
    accountNumber: "",
    idDocument: "", // 신분증/사업자등록증
  });

  // 세금 계산서 발행 정보 상태
  const [taxInfo, setTaxInfo] = useState({
    businessType: "individual", // individual 또는 corporation
    businessName: "",
    businessNumber: "",
    ceoName: "",
    address: "",
    businessCategory: "",
    businessItem: "",
    email: "",
    businessRegistrationFile: "",
  });

  // 양조장 정보 불러오기 (AuthContext에서 실제 데이터)
  const loadBreweryInfo = () => {
    if (user && user.type === "brewery") {
      setCreatorInfo({
        name: user.breweryName || "",
        profileImage: "",
        bio: "",
        phone: user.phone || "",
        accountBank: "",
        accountNumber: "",
        idDocument: "",
      });
      setTaxInfo({
        businessType: "corporation",
        businessName: user.breweryName || "",
        businessNumber: user.businessNumber || "",
        ceoName: user.name || "",
        address: user.breweryLocation || "",
        businessCategory: "제조업",
        businessItem: "탁주 제조",
        email: user.email || "",
        businessRegistrationFile: "",
      });
      toast.success("양조장 정보를 불러왔습니다");
    }
  };

  // 타이머 효과
  useEffect(() => {
    if (phoneTimer > 0) {
      const interval = setInterval(() => {
        setPhoneTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phoneTimer]);

  // 맛 지표 상태
  const [tasteProfile, setTasteProfile] = useState({
    sweetness: 50, // 단맛
    aroma: 50, // 잔향
    acidity: 50, // 산미
    body: 60, // 바디감
    carbonation: 50, // 탄산감
  });

  // 안내 사항 상태
  const [trustInfo, setTrustInfo] = useState({
    projectPolicy: `환불: 프로젝트 마감 후 즉시 양조 공정이 시작되므로 단순 변심 환불은 불가합니다. 단, 양조장의 사정으로 생산이 불가능해질 경우 100% 환불을 보장합니다.

교환/AS: 주류 배송 특성상 파손된 상태로 수령 시, 사진과 함께 접수해주시면 즉시 새 제품으로 교환해 드립니다.

성인인증: 본 프로젝트는 성인인증을 완료한 후원자만 참여 가능하며, 배송 시 대리 수령이 제한될 수 있습니다.`,
    expectedDifficulties: `품질 변동: AI 검토와 전문가의 관리를 거치나, 기온 변화에 따라 도수나 당도가 기획안과 ±1~2% 정도 차이가 날 수 있습니다.

일정 지연: 술이 충분히 익지 않았을 경우, 최상의 맛을 위해 출고가 최대 10일 정도 지연될 수 있으며 이 경우 커뮤니티를 통해 즉시 공지하겠습니다.`,
  });

  // 전체 진행률 계산
  const calculateProgress = () => {
    let total = 0;
    let completed = 0;

    // 1. 기본정보 (6개 필수 항목)
    const basicFields = [
      basicInfo.category,
      basicInfo.title,
      basicInfo.mainIngredient,
      basicInfo.alcoholContent,
      basicInfo.summary,
      basicInfo.images.length > 0,
    ];
    basicFields.forEach(field => {
      total++;
      if (field) completed++;
    });

    // 2. 목표 금액 및 일정 (4개 필수 항목)
    const fundingFields = [
      fundingInfo.pricePerBottle,
      fundingInfo.bottleQuantity,
      fundingInfo.startDate,
      fundingInfo.expectedDeliveryDate,
    ];
    fundingFields.forEach(field => {
      total++;
      if (field) completed++;
    });

    // 3. 법적 고시 정보 (4개 기본 + 추가 구성요소마다 2개)
    const productFields = [
      productInfo.volume,
      productInfo.alcoholContent,
    ];
    productFields.forEach(field => {
      total++;
      if (field) completed++;
    });
    
    // 모든 구성요소의 주소재와 원산지 확인
    productInfo.ingredients.forEach(item => {
      total += 2; // 주소재 + 원산지
      if (item.ingredient) completed++;
      if (item.origin) completed++;
    });

    // 4. 프로젝트 계획 (1개 필수 항목)
    total++;
    if (projectPlan.introduction) completed++;

    // 5. 양조장 정보 (12개 필수 항목)
    const creatorFields = [
      creatorInfo.name,
      phoneVerified, // 본인 인증
      accountVerified, // 입금 계좌
      taxInfo.businessType,
      taxInfo.businessName,
      taxInfo.businessNumber,
      taxInfo.ceoName,
      taxInfo.address,
      taxInfo.businessCategory,
      taxInfo.businessItem,
      taxInfo.email,
      taxInfo.businessRegistrationFile || uploadedFiles.businessLicense,
    ];
    creatorFields.forEach(field => {
      total++;
      if (field) completed++;
    });

    // 6. 인증 서류 (3개 필수 파일)
    const certificationFiles = [
      uploadedFiles.salesPermit, // 통신판매신고증
      uploadedFiles.alcoholPermit, // 주류통신판매 승인
      uploadedFiles.manufacturingLicense, // 전통주 제조 면허증
    ];
    certificationFiles.forEach(file => {
      total++;
      if (file) completed++;
    });

    const totalProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return totalProgress;
  };

  const progress = calculateProgress();

  // 작성 중인 내용이 있는지 확인
  const hasUnsavedChanges = () => {
    return (
      basicInfo.title ||
      basicInfo.summary ||
      fundingInfo.goalAmount ||
      fundingInfo.startDate ||
      productInfo.volume ||
      productInfo.alcoholContent ||
      productInfo.ingredients.some(item => item.ingredient || item.origin) ||
      projectPlan.introduction ||
      creatorInfo.name
    );
  };

  // X 버튼 클릭 핸들러
  const handleExit = () => {
    if (hasUnsavedChanges()) {
      setShowExitConfirm(true);
    } else {
      navigate("/funding");
    }
  };

  // 임시 저장 후 나가기
  const handleSaveAndExit = () => {
    handleSave();
    setShowExitConfirm(false);
    setTimeout(() => {
      navigate("/funding");
    }, 500);
  };

  // 저장 없이 나가기
  const handleExitWithoutSave = () => {
    setShowExitConfirm(false);
    navigate("/funding");
  };

  // 구성요소 추가
  const addIngredient = () => {
    setProductInfo({
      ...productInfo,
      ingredients: [
        ...productInfo.ingredients,
        { id: Date.now(), ingredient: "", origin: "" }
      ]
    });
  };

  // 구성요소 삭제
  const removeIngredient = (id: number) => {
    if (productInfo.ingredients.length > 1) {
      setProductInfo({
        ...productInfo,
        ingredients: productInfo.ingredients.filter((item) => item.id !== id)
      });
    }
  };

  // 태그 추가
  const addTag = (tag: string) => {
    if (tag && !basicInfo.tags.includes(tag) && basicInfo.tags.length < 10) {
      setBasicInfo({ ...basicInfo, tags: [...basicInfo.tags, tag] });
    }
  };

  // Alert 모달 함수
  const showAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  // 실제 이미지 파일 업로드
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      const maxImages = 5 - basicInfo.images.length;
      const filesToProcess = Math.min(files.length, maxImages);

      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === filesToProcess) {
            setBasicInfo({
              ...basicInfo,
              images: [...basicInfo.images, ...newImages],
            });
            toast.success(`${filesToProcess}개의 이미지가 추가되었습니다`);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // 이미지 순서 변경 (드래그 앤 드롭)
  const handleImageDragStart = (index: number) => {
    setDraggedImageIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedImageIndex === null || draggedImageIndex === index) return;

    const newImages = [...basicInfo.images];
    const draggedImage = newImages[draggedImageIndex];
    newImages.splice(draggedImageIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setBasicInfo({ ...basicInfo, images: newImages });
    setDraggedImageIndex(index);
  };

  const handleImageDragEnd = () => {
    setDraggedImageIndex(null);
  };

  // 날짜 검증
  const validateDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (fundingInfo.startDate) {
      const startDate = new Date(fundingInfo.startDate);
      if (startDate < today) {
        showAlert("펀딩 시작일은 오늘 이후여야 합니다.");
        return false;
      }
    }

    if (fundingInfo.startDate && fundingInfo.expectedDeliveryDate) {
      const startDate = new Date(fundingInfo.startDate);
      const deliveryDate = new Date(fundingInfo.expectedDeliveryDate);
      const minDeliveryDate = new Date(startDate);
      minDeliveryDate.setDate(minDeliveryDate.getDate() + fundingInfo.duration + 30); // 펀딩 기간 + 최소 30일

      if (deliveryDate < minDeliveryDate) {
        showAlert("배송 예정일은 펀딩 종료 후 최소 30일 이후여야 합니다.");
        return false;
      }
    }

    return true;
  };

  // 임시 저장
  const handleSave = () => {
    // 기존 저장된 데이터 확인
    const existingSave = localStorage.getItem("judam_project_temp_save");

    if (existingSave) {
      // 저장된 데이터가 있으면 모달 표시
      const saveData = JSON.parse(existingSave);
      setTempSaveTimestamp(saveData.timestamp);
      setShowTempSaveModal(true);
    } else {
      // 저장된 데이터가 없으면 자동 저장
      saveToLocalStorage();
    }
  };

  const saveToLocalStorage = () => {
    setIsSaving(true);
    const saveData = {
      timestamp: new Date().toISOString(),
      basicInfo,
      fundingInfo,
      productInfo,
      projectPlan,
      creatorInfo,
      taxInfo,
      tasteProfile,
      trustInfo,
      uploadedFiles,
      phoneVerified,
      accountVerified,
    };

    localStorage.setItem("judam_project_temp_save", JSON.stringify(saveData));

    setTimeout(() => {
      setIsSaving(false);
      toast.success("임시 저장되었습니다");
    }, 1000);
  };

  const loadFromLocalStorage = () => {
    const existingSave = localStorage.getItem("judam_project_temp_save");
    if (existingSave) {
      const saveData = JSON.parse(existingSave);
      setBasicInfo(saveData.basicInfo);
      setFundingInfo(saveData.fundingInfo);
      setProductInfo(saveData.productInfo);
      setProjectPlan(saveData.projectPlan);
      setCreatorInfo(saveData.creatorInfo);
      setTaxInfo(saveData.taxInfo);
      setTasteProfile(saveData.tasteProfile);
      setTrustInfo(saveData.trustInfo);
      setUploadedFiles(saveData.uploadedFiles);
      setPhoneVerified(saveData.phoneVerified);
      setAccountVerified(saveData.accountVerified);
      setShowTempSaveModal(false);
      toast.success("불러오기 완료");
    }
  };

  const deleteTempSave = () => {
    localStorage.removeItem("judam_project_temp_save");
    setShowTempSaveModal(false);
    toast.success("임시 저장 삭제됨");
  };

  // 제출 확인 모달 열기
  const handleSubmit = () => {
    // 날짜 검증
    if (!validateDates()) {
      return;
    }

    const progress = calculateProgress();
    if (progress < 100) {
      // 필수 항목 체크 및 시각적 피드백
      const errors: Record<string, boolean> = {};

      // 기본정보 체크
      if (!basicInfo.category) errors.category = true;
      if (!basicInfo.title) errors.title = true;
      if (!basicInfo.mainIngredient) errors.mainIngredient = true;
      if (!basicInfo.alcoholContent) errors.alcoholContent = true;
      if (!basicInfo.summary) errors.summary = true;
      if (basicInfo.images.length === 0) errors.images = true;

      // 펀딩 정보 체크
      if (!fundingInfo.pricePerBottle) errors.pricePerBottle = true;
      if (!fundingInfo.bottleQuantity) errors.bottleQuantity = true;
      if (!fundingInfo.startDate) errors.startDate = true;
      if (!fundingInfo.expectedDeliveryDate) errors.expectedDeliveryDate = true;

      // 제품 정보 체크
      if (!productInfo.volume) errors.volume = true;
      if (!productInfo.alcoholContent) errors.productAlcoholContent = true;

      setValidationErrors(errors);

      // 첫 번째 미입력 필드로 스크롤
      if (!basicInfo.category || !basicInfo.title) {
        setActiveTab("basic");
      } else if (!fundingInfo.pricePerBottle || !fundingInfo.startDate) {
        setActiveTab("funding");
      } else if (!productInfo.volume) {
        setActiveTab("rewards");
      } else if (!creatorInfo.name) {
        setActiveTab("creator");
      } else if (!uploadedFiles.salesPermit) {
        setActiveTab("verification");
      }

      showAlert("필수 항목을 모두 입력해주세요.");
      return;
    }

    setValidationErrors({});
    setShowSubmitConfirm(true);
  };

  // 제출 확정
  const confirmSubmit = () => {
    setShowSubmitConfirm(false);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSubmitSuccess(true);
    }, 1000);
  };

  // 제출 성공 후 펀딩 페이지로 이동
  const handleSubmitSuccessClose = () => {
    setShowSubmitSuccess(false);
    navigate("/funding");
  };

  // 휴대폰 인증번호 발송
  const handleSendPhoneVerification = () => {
    if (!creatorInfo.phone || creatorInfo.phone.length < 10) {
      showAlert("휴대폰 번호를 정확히 입력해주세요.");
      return;
    }
    setPhoneVerificationSent(true);
    setPhoneTimer(180); // 3분 타이머
    toast.success("인증 번호가 발송되었습니다.");
  };

  // 휴대폰 인증 확인
  const handleVerifyPhone = () => {
    if (phoneVerificationCode.length === 6) {
      setPhoneVerified(true);
      setPhoneTimer(0);
      toast.success("인증완료!");
    } else {
      showAlert("인증번호 6자리를 입력해주세요.");
    }
  };

  // 계좌 인증
  const handleVerifyAccount = () => {
    if (!creatorInfo.accountBank || !creatorInfo.accountNumber) {
      showAlert("은행과 계좌번호를 입력해주세요.");
      return;
    }
    setAccountVerified(true);
    toast.success("인증완료!");
  };

  // 파일 업로드 핸들러
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: keyof typeof uploadedFiles
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: file.name
      }));

      // 프로필 이미지인 경우 미리보기 설정
      if (fileType === "profileImage") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCreatorInfo({
            ...creatorInfo,
            profileImage: reader.result as string
          });
        };
        reader.readAsDataURL(file);
      }

      toast.success(`${file.name} 파일이 선택되었습니다.`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[430px] mx-auto">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleExit}
            className="p-2 -ml-2"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-base font-bold text-gray-900">
            펀딩 프로젝트 만들기
          </h1>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 -mr-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <Eye className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        {/* 진행률 */}
        <div className="px-4 py-2 bg-gray-50 flex items-center justify-end gap-2">
          <span className="text-xs text-gray-600">기획중</span>
          <span className="text-xs font-bold text-gray-900">{progress}% 완료</span>
        </div>

        {/* 프로젝트 정보 미리보기 (간략) */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {basicInfo.images[0] ? (
                <img src={basicInfo.images[0]} alt="" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <ImageIcon className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">{basicInfo.category || "카테고리"}</p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {basicInfo.title || "프로젝트 제목"}
              </p>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 (가로 스크롤) */}
        <div 
          ref={tabScrollRef}
          className="flex overflow-x-auto hide-scrollbar border-b border-gray-200"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {projectTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-500"
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                  />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* 메인 컨텐츠 (스크롤 영역) */}
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* 기본 정보 */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  {/* 심사 기준 고지 */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-blue-900 mb-2">
                          프로젝트 심사 기준 안내
                        </p>
                        <ul className="text-xs text-blue-800 leading-relaxed space-y-1.5">
                          <li>• 전통주 제조 면허증 및 통신판매 신고증이 있어야 합니다</li>
                          <li>• 프로젝트 내용과 리워드가 명확하게 작성되어야 합니다</li>
                          <li>• 발송 일정 및 환불 정책이 구체적으로 명시되어야 합니다</li>
                          <li>• 심사는 3-5영업일이 소요되며, 승인 후 펀딩을 시작할 수 있습니다</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 성인 인증 안내 */}
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-900 mb-1">
                          전통주 프로젝트 필수 설정
                        </p>
                        <p className="text-xs text-red-700 leading-relaxed">
                          19세 이상 성인만 후원 가능합니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 프로젝트 카테고리 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      프로젝트 카테고리 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={basicInfo.category}
                      onChange={(e) =>
                        setBasicInfo({ ...basicInfo, category: e.target.value })
                      }
                      placeholder="예: 과일 복숭아"
                      className={`w-full px-4 py-3 border rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 font-medium placeholder:text-gray-400 ${
                        validationErrors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.category && (
                      <p className="text-xs text-red-600">카테고리를 입력해주세요.</p>
                    )}
                  </div>

                  {/* 프로젝트 제목 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      프로젝트 제목 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={basicInfo.title}
                      onChange={(e) =>
                        setBasicInfo({ ...basicInfo, title: e.target.value })
                      }
                      placeholder="봄을 담은 벚꽃 막걸리 프로젝트"
                      className={`w-full px-4 py-3 border rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 font-medium placeholder:text-gray-400 ${
                        validationErrors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      maxLength={50}
                    />
                    {validationErrors.title ? (
                      <p className="text-xs text-red-600">프로젝트 제목을 입력해주세요.</p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        {basicInfo.title.length}/50자
                      </p>
                    )}
                  </div>

                  {/* 짧은 제목 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      짧은 제목
                    </label>
                    <p className="text-xs text-gray-600">
                      목록에서 표시될 짧은 제목입니다.
                    </p>
                    <input
                      type="text"
                      value={basicInfo.shortTitle}
                      onChange={(e) =>
                        setBasicInfo({
                          ...basicInfo,
                          shortTitle: e.target.value,
                        })
                      }
                      placeholder="벚꽃 막걸리"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 font-medium placeholder:text-gray-400"
                      maxLength={20}
                    />
                  </div>

                  {/* 메인 재료 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      메인 재료 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={basicInfo.mainIngredient}
                      onChange={(e) =>
                        setBasicInfo({
                          ...basicInfo,
                          mainIngredient: e.target.value,
                        })
                      }
                      placeholder="예: 국내산 쌀"
                      className={`w-full px-4 py-3 border rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 font-medium placeholder:text-gray-400 ${
                        validationErrors.mainIngredient ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.mainIngredient && (
                      <p className="text-xs text-red-600">메인 재료를 입력해주세요.</p>
                    )}
                  </div>

                  {/* 서브 재료 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      서브 재료
                    </label>
                    <input
                      type="text"
                      value={basicInfo.subIngredient}
                      onChange={(e) =>
                        setBasicInfo({
                          ...basicInfo,
                          subIngredient: e.target.value,
                        })
                      }
                      placeholder="예: 복숭아, 누룩"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 font-medium placeholder:text-gray-400"
                    />
                  </div>

                  {/* 도수 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      도수 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={basicInfo.alcoholContent}
                        onChange={(e) =>
                          setBasicInfo({
                            ...basicInfo,
                            alcoholContent: e.target.value,
                          })
                        }
                        placeholder="6"
                        step="0.1"
                        min="0"
                        max="100"
                        className={`flex-1 px-4 py-3 border rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 font-medium placeholder:text-gray-400 ${
                          validationErrors.alcoholContent ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <span className="text-sm text-gray-600 font-medium">%</span>
                    </div>
                    {validationErrors.alcoholContent && (
                      <p className="text-xs text-red-600">도수를 입력해주세요.</p>
                    )}
                  </div>

                  {/* 프로젝트 요약 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      프로젝트 요약 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={basicInfo.summary}
                      onChange={(e) =>
                        setBasicInfo({ ...basicInfo, summary: e.target.value })
                      }
                      placeholder="프로젝트를 한 문장으로 소개해주세요."
                      className={`w-full px-4 py-3 border rounded-xl focus:border-gray-900 focus:outline-none transition-colors resize-none text-sm text-gray-900 font-medium placeholder:text-gray-400 ${
                        validationErrors.summary ? 'border-red-500' : 'border-gray-300'
                      }`}
                      rows={3}
                      maxLength={150}
                    />
                    {validationErrors.summary ? (
                      <p className="text-xs text-red-600">프로젝트 요약을 입력해주세요.</p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        {basicInfo.summary.length}/150자
                      </p>
                    )}
                  </div>

                  {/* 대표 이미지 업로드 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-gray-900">
                        프로젝트 대표 이미지 <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">
                        {basicInfo.images.length}/5
                      </span>
                    </div>
                    {validationErrors.images && (
                      <p className="text-xs text-red-600">이미지를 1개 이상 등록해주세요.</p>
                    )}
                    <p className="text-xs text-gray-600 mb-3">
                      드래그하여 순서를 변경할 수 있습니다. 첫 번째 이미지가 대표 이미지로 표시됩니다.
                    </p>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                    <div className="flex gap-3 overflow-x-auto">
                      {basicInfo.images.length < 5 && (
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="flex-shrink-0 w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-1.5"
                        >
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            이미지 추가
                          </span>
                        </button>
                      )}
                      {basicInfo.images.map((img, idx) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={() => handleImageDragStart(idx)}
                          onDragOver={(e) => handleImageDragOver(e, idx)}
                          onDragEnd={handleImageDragEnd}
                          className={`relative flex-shrink-0 w-32 h-32 bg-gray-100 rounded-xl overflow-hidden group cursor-move ${
                            draggedImageIndex === idx ? 'opacity-50' : ''
                          }`}
                        >
                          <img
                            src={img}
                            alt={`이미지 ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 left-1 px-2 py-0.5 bg-black/70 rounded text-xs text-white">
                            {idx + 1}
                          </div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-6 h-6 text-white drop-shadow-lg" />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setBasicInfo({
                                ...basicInfo,
                                images: basicInfo.images.filter(
                                  (_, i) => i !== idx
                                ),
                              })
                            }
                            className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black rounded-full transition-colors"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 검색 태그 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      검색 태그
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {basicInfo.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-900 font-medium"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                          <button
                            type="button"
                            onClick={() =>
                              setBasicInfo({
                                ...basicInfo,
                                tags: basicInfo.tags.filter((_, i) => i !== idx),
                              })
                            }
                            className="hover:bg-gray-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="태그를 입력하고 Enter"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addTag(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 font-medium placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}

              {/* 목표 금액 및 일정 */}
              {activeTab === "funding" && (
                <div className="space-y-6">
                  {/* 병당 가격 및 판매 수량 */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* 각 병당 얼마 */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-900">
                        각 병당 얼마 (원) <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={fundingInfo.pricePerBottle}
                          onChange={(e) => {
                            const pricePerBottle = e.target.value;
                            const goalAmount = pricePerBottle && fundingInfo.bottleQuantity
                              ? String(Number(pricePerBottle) * Number(fundingInfo.bottleQuantity))
                              : "";
                            setFundingInfo({
                              ...fundingInfo,
                              pricePerBottle,
                              goalAmount,
                            });
                          }}
                          placeholder="30000"
                          className={`w-full px-2 py-2.5 border rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-xs text-gray-900 font-medium placeholder:text-gray-400 ${
                            validationErrors.pricePerBottle ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <span className="text-xs text-gray-600 font-medium whitespace-nowrap">원</span>
                      </div>
                      {validationErrors.pricePerBottle && (
                        <p className="text-xs text-red-600">병당 가격을 입력해주세요.</p>
                      )}
                    </div>

                    {/* 몇 병 */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-900">
                        몇 병 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={fundingInfo.bottleQuantity}
                          onChange={(e) => {
                            const bottleQuantity = e.target.value;
                            const goalAmount = fundingInfo.pricePerBottle && bottleQuantity
                              ? String(Number(fundingInfo.pricePerBottle) * Number(bottleQuantity))
                              : "";
                            setFundingInfo({
                              ...fundingInfo,
                              bottleQuantity,
                              goalAmount,
                            });
                          }}
                          placeholder="500"
                          className={`w-full px-2 py-2.5 border rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-xs text-gray-900 font-medium placeholder:text-gray-400 ${
                            validationErrors.bottleQuantity ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <span className="text-xs text-gray-600 font-medium whitespace-nowrap">병</span>
                      </div>
                      {validationErrors.bottleQuantity && (
                        <p className="text-xs text-red-600">판매 수량을 입력해주세요.</p>
                      )}
                    </div>
                  </div>

                  {/* 목표 금액 (자동 계산) */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="block text-sm font-bold text-gray-900">
                        목표 금액 <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                        자동 계산됨
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={fundingInfo.goalAmount ? Number(fundingInfo.goalAmount).toLocaleString() : ""}
                        readOnly
                        placeholder="병당 가격 × 수량"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-900 font-medium placeholder:text-gray-400"
                      />
                      <span className="text-sm text-gray-600 font-medium">원</span>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <p className="text-xs text-blue-900">
                        💡 수수료: 플랫폼 7%가 차감됩니다.
                      </p>
                    </div>
                  </div>

                  {/* 펀딩 시작일 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      펀딩 시작일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={fundingInfo.startDate}
                      onChange={(e) =>
                        setFundingInfo({
                          ...fundingInfo,
                          startDate: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 font-medium ${
                        validationErrors.startDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.startDate && (
                      <p className="text-xs text-red-600">펀딩 시작일을 입력해주세요.</p>
                    )}
                  </div>

                  {/* 펀딩 기간 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      프로젝트 기간
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={fundingInfo.duration}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 1 && value <= 365) {
                            setFundingInfo({
                              ...fundingInfo,
                              duration: value,
                            });
                          }
                        }}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 font-medium"
                        placeholder="펀딩 기간을 입력하세요"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-600 font-medium">
                        일
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      1일부터 365일까지 입력 가능합니다.
                    </p>
                  </div>

                  {/* 펀딩 종료일 (자동 계산) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      펀딩 종료일
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700">
                      {fundingInfo.startDate
                        ? new Date(
                            new Date(fundingInfo.startDate).getTime() +
                              fundingInfo.duration * 24 * 60 * 60 * 1000
                          )
                            .toISOString()
                            .split("T")[0]
                        : "시작일을 선택하면 자동으로 계산됩니다"}
                    </div>
                  </div>

                  {/* 예상 배송일 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      예상 발송 시작일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={fundingInfo.expectedDeliveryDate}
                      onChange={(e) =>
                        setFundingInfo({
                          ...fundingInfo,
                          expectedDeliveryDate: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 font-medium ${
                        validationErrors.expectedDeliveryDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.expectedDeliveryDate && (
                      <p className="text-xs text-red-600">배송 예정일을 입력해주세요.</p>
                    )}
                    <p className="text-xs text-gray-600">
                      펀딩 종료 후 제작 및 배송에 소요되는 기간을 고려해주세요 (최소 30일).
                    </p>
                  </div>

                  {/* 일정 요약 */}
                  <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                    <h3 className="text-sm font-bold text-gray-900">일정 요약</h3>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">펀딩 시작</span>
                        <span className="font-medium text-gray-900">
                          {fundingInfo.startDate || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">펀딩 종료</span>
                        <span className="font-medium text-gray-900">
                          {fundingInfo.startDate
                            ? new Date(
                                new Date(fundingInfo.startDate).getTime() +
                                  fundingInfo.duration * 24 * 60 * 60 * 1000
                              )
                                .toISOString()
                                .split("T")[0]
                            : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">배송 시작 예정</span>
                        <span className="font-medium text-gray-900">
                          {fundingInfo.expectedDeliveryDate || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 리워드 구성 */}
              {activeTab === "rewards" && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      💡 제품의 법적 고시 정보와 구성 원재료를 입력해주세요. 구성요소는 여러 개 추가할 수 있습니다.
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold text-gray-900">
                      법적 고시 정보
                    </h3>

                    <div className="space-y-3">
                      {/* 상품 분류 (비활성화) */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          상품 분류 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={productInfo.productType}
                          disabled
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-sm text-gray-500 cursor-not-allowed"
                        />
                      </div>

                      {/* 용량 및 도수 */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            용량 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={productInfo.volume}
                            onChange={(e) =>
                              setProductInfo({
                                ...productInfo,
                                volume: e.target.value,
                              })
                            }
                            placeholder="예: 750ml"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 placeholder:text-gray-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            도수 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={productInfo.alcoholContent}
                            onChange={(e) =>
                              setProductInfo({
                                ...productInfo,
                                alcoholContent: e.target.value,
                              })
                            }
                            placeholder="예: 6%"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      {/* 구성요소 (원재료) */}
                      <div className="pt-3 border-t border-gray-200">
                        <h4 className="text-xs font-bold text-gray-900 mb-3">
                          구성요소 (원재료) <span className="text-red-500">*</span>
                        </h4>
                        <div className="space-y-3">
                          {productInfo.ingredients.map((item, idx) => (
                            <div
                              key={item.id}
                              className="relative p-3 border border-gray-200 rounded-lg bg-white"
                            >
                              {/* 삭제 버튼 */}
                              {productInfo.ingredients.length > 1 && (
                                <button
                                  onClick={() => removeIngredient(item.id)}
                                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                                  aria-label="구성요소 삭제"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}

                              <div className="space-y-3 pr-6">
                                <div>
                                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    주 소재 <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={item.ingredient}
                                    onChange={(e) => {
                                      const newIngredients = [...productInfo.ingredients];
                                      newIngredients[idx].ingredient = e.target.value;
                                      setProductInfo({
                                        ...productInfo,
                                        ingredients: newIngredients,
                                      });
                                    }}
                                    placeholder="예: 쌀(국산)"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 placeholder:text-gray-400"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    원산지 <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={item.origin}
                                    onChange={(e) => {
                                      const newIngredients = [...productInfo.ingredients];
                                      newIngredients[idx].origin = e.target.value;
                                      setProductInfo({
                                        ...productInfo,
                                        ingredients: newIngredients,
                                      });
                                    }}
                                    placeholder="예: 경기도 양평"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 placeholder:text-gray-400"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={addIngredient}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-600 text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    구성요소 추가
                  </button>
                </div>
              )}

              {/* 맛 지표 */}
              {activeTab === "taste" && (
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      💡 이 전통주의 맛을 표현해주세요. 각 지표를 조절하면 실시간으로 레이더 차트에 반영됩니다.
                    </p>
                  </div>

                  {/* 맛 지표 슬라이더들 */}
                  <div className="space-y-5">
                    {[
                      { key: "sweetness", label: "단맛", desc: "달콤한 정도" },
                      { key: "aroma", label: "잔향", desc: "향이 나는 정도" },
                      { key: "acidity", label: "산미", desc: "산뜻한 정도" },
                      { key: "body", label: "바디감", desc: "묵직함과 풍미" },
                      { key: "carbonation", label: "탄산감", desc: "탄산 느낌" },
                    ].map((taste) => (
                      <div key={taste.key}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <label className="block text-sm font-bold text-gray-900">
                              {taste.label}
                            </label>
                            <p className="text-xs text-gray-500">{taste.desc}</p>
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            {tasteProfile[taste.key as keyof typeof tasteProfile]}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={tasteProfile[taste.key as keyof typeof tasteProfile]}
                          onChange={(e) =>
                            setTasteProfile({
                              ...tasteProfile,
                              [taste.key]: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>약함</span>
                          <span>강함</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 맛 지표 차트 미리보기 */}
                  <div className="p-6 bg-white border-2 border-gray-200 rounded-xl">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 text-center">
                      맛 지표 미리보기
                    </h3>
                    <div className="flex justify-center">
                      <div className="w-full max-w-sm">
                        <svg viewBox="0 0 400 400" className="w-full h-auto">
                          {/* 배경 오각형 그리드 */}
                          {[1, 0.75, 0.5, 0.25].map((scale) => (
                            <polygon
                              key={scale}
                              points={[
                                [200, 200 - 150 * scale],
                                [200 + 142.5 * scale, 200 - 46.4 * scale],
                                [200 + 88.1 * scale, 200 + 121.5 * scale],
                                [200 - 88.1 * scale, 200 + 121.5 * scale],
                                [200 - 142.5 * scale, 200 - 46.4 * scale],
                              ].map(p => p.join(',')).join(' ')}
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="1"
                            />
                          ))}
                          
                          {/* 축선 */}
                          {[
                            [200, 50],
                            [342.5, 153.6],
                            [288.1, 321.5],
                            [111.9, 321.5],
                            [57.5, 153.6],
                          ].map((point, i) => (
                            <line
                              key={i}
                              x1="200"
                              y1="200"
                              x2={point[0]}
                              y2={point[1]}
                              stroke="#e5e7eb"
                              strokeWidth="1"
                            />
                          ))}

                          {/* 데이터 폴리곤 */}
                          <polygon
                            points={[
                              [200, 200 - (tasteProfile.sweetness / 100) * 150],
                              [200 + (tasteProfile.aroma / 100) * 142.5, 200 - (tasteProfile.aroma / 100) * 46.4],
                              [200 + (tasteProfile.acidity / 100) * 88.1, 200 + (tasteProfile.acidity / 100) * 121.5],
                              [200 - (tasteProfile.body / 100) * 88.1, 200 + (tasteProfile.body / 100) * 121.5],
                              [200 - (tasteProfile.carbonation / 100) * 142.5, 200 - (tasteProfile.carbonation / 100) * 46.4],
                            ].map(p => p.join(',')).join(' ')}
                            fill="rgba(0, 0, 0, 0.2)"
                            stroke="rgba(0, 0, 0, 0.8)"
                            strokeWidth="2"
                          />

                          {/* 데이터 포인트 */}
                          {[
                            { x: 200, y: 200 - (tasteProfile.sweetness / 100) * 150 },
                            { x: 200 + (tasteProfile.aroma / 100) * 142.5, y: 200 - (tasteProfile.aroma / 100) * 46.4 },
                            { x: 200 + (tasteProfile.acidity / 100) * 88.1, y: 200 + (tasteProfile.acidity / 100) * 121.5 },
                            { x: 200 - (tasteProfile.body / 100) * 88.1, y: 200 + (tasteProfile.body / 100) * 121.5 },
                            { x: 200 - (tasteProfile.carbonation / 100) * 142.5, y: 200 - (tasteProfile.carbonation / 100) * 46.4 },
                          ].map((point, i) => (
                            <circle
                              key={i}
                              cx={point.x}
                              cy={point.y}
                              r="4"
                              fill="black"
                            />
                          ))}

                          {/* 레이블 */}
                          <text x="200" y="40" textAnchor="middle" className="text-xs font-bold" fill="#374151">단맛</text>
                          <text x="360" y="160" textAnchor="start" className="text-xs font-bold" fill="#374151">잔향</text>
                          <text x="295" y="345" textAnchor="middle" className="text-xs font-bold" fill="#374151">산미</text>
                          <text x="105" y="345" textAnchor="middle" className="text-xs font-bold" fill="#374151">바디감</text>
                          <text x="40" y="160" textAnchor="end" className="text-xs font-bold" fill="#374151">탄산감</text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 프로젝트 계획 */}
              {activeTab === "plan" && (
                <div className="space-y-6">
                  {/* 프로젝트 ��개 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      프로젝트 소개 <span className="text-red-500">*</span>
                    </label>
                    <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-xs text-gray-700 mb-2">
                      <p>• 무엇을 만들기 위한 프로젝트인가요?</p>
                      <p>• 프로젝트를 간단히 소개한다면?</p>
                      <p>• 이 프로젝트가 왜 의미있나요?</p>
                      <p>• 이 프로젝트를 시작하게 된 배경은?</p>
                    </div>
                    <textarea
                      value={projectPlan.introduction}
                      onChange={(e) =>
                        setProjectPlan({
                          ...projectPlan,
                          introduction: e.target.value,
                        })
                      }
                      placeholder="프로젝트에 대해 자세히 설명해주세요..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors resize-none text-sm text-gray-900 font-medium placeholder:text-gray-400"
                      rows={8}
                    />
                  </div>

                  {/* 프로젝트 예산 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      프로젝트 예산
                    </label>
                    <p className="text-xs text-gray-600">
                      목표 금액을 어디에 사용할지 구체적으로 작성해주세요.
                    </p>
                    <textarea
                      value={projectPlan.budget}
                      onChange={(e) =>
                        setProjectPlan({
                          ...projectPlan,
                          budget: e.target.value,
                        })
                      }
                      placeholder="예시:&#10;- 원료비: 200만원&#10;- 인건비: 150만원&#10;- 포장비: 100만원"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors resize-none text-sm text-gray-900 font-mono placeholder:text-gray-400"
                      rows={6}
                    />
                  </div>

                  {/* 프로젝트 일정 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      프로젝트 일정
                    </label>
                    <textarea
                      value={projectPlan.schedule}
                      onChange={(e) =>
                        setProjectPlan({
                          ...projectPlan,
                          schedule: e.target.value,
                        })
                      }
                      placeholder="예시:&#10;- 4월 1일: 발효 시작&#10;- 4월 20일: 1차 숙성 완료&#10;- 5월 10일: 병입 작업&#10;- 5월 20일: 라벨링 및 포장&#10;- 6월 1일: 배송 시작"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors resize-none text-sm text-gray-900 font-mono placeholder:text-gray-400"
                      rows={8}
                    />
                  </div>
                </div>
              )}

              {/* 양조장 정보 */}
              {activeTab === "creator" && (
                <div className="space-y-6">
                  {/* 양조장 이름 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-bold text-gray-900">
                        창작자 이름 <span className="text-red-500">*</span>
                      </label>
                      <button
                        onClick={loadBreweryInfo}
                        className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        불러오기
                      </button>
                    </div>
                    <input
                      type="text"
                      value={creatorInfo.name}
                      onChange={(e) =>
                        setCreatorInfo({ ...creatorInfo, name: e.target.value })
                      }
                      placeholder="꽃샘양조장"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 font-medium placeholder:text-gray-400"
                    />
                  </div>

                  {/* 프로필 이미지 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      프로필 이미지
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                        {creatorInfo.profileImage ? (
                          <img
                            src={creatorInfo.profileImage}
                            alt="프로필"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <input
                        ref={profileImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "profileImage")}
                        className="hidden"
                      />
                      <button 
                        onClick={() => profileImageInputRef.current?.click()}
                        className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors text-sm font-medium"
                      >이미지 업로드</button>
                    </div>
                    {uploadedFiles.profileImage && (
                      <p className="text-xs text-gray-500">
                        선택됨: {uploadedFiles.profileImage}
                      </p>
                    )}
                  </div>

                  {/* 양조장 소개 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      창작자 소개
                    </label>
                    <textarea
                      value={creatorInfo.bio}
                      onChange={(e) =>
                        setCreatorInfo({ ...creatorInfo, bio: e.target.value })
                      }
                      placeholder="양조장을 소개해주세요..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors resize-none text-sm text-gray-900 font-medium placeholder:text-gray-400"
                      rows={4}
                    />
                  </div>

                  {/* 연락처 및 본인 인증 */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-900">
                      본인 인증 <span className="text-red-500">*</span>
                    </label>
                    
                    {/* 휴대폰 번호 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        휴대폰 번호
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          value={creatorInfo.phone}
                          onChange={(e) =>
                            setCreatorInfo({ ...creatorInfo, phone: e.target.value })
                          }
                          placeholder="010-1234-5678"
                          disabled={phoneVerified}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 font-medium placeholder:text-gray-400 disabled:bg-gray-100"
                        />
                        {!phoneVerified && (
                          <button
                            onClick={handleSendPhoneVerification}
                            disabled={!creatorInfo.phone || creatorInfo.phone.length < 10}
                            className="px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            인증하기
                          </button>
                        )}
                        {phoneVerified && (
                          <div className="px-4 py-3 bg-green-50 text-green-700 text-xs font-bold rounded-xl flex items-center">
                            인증완료!
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 인증번호 입력 (발송 후 표시) */}
                    {phoneVerificationSent && !phoneVerified && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-medium text-gray-700">
                            인증번호
                          </label>
                          {phoneTimer > 0 && (
                            <span className="text-xs font-semibold text-red-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {Math.floor(phoneTimer / 60)}:{String(phoneTimer % 60).padStart(2, '0')}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={phoneVerificationCode}
                            onChange={(e) => setPhoneVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="6자리 입력"
                            maxLength={6}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 font-medium placeholder:text-gray-400"
                          />
                          <button
                            onClick={handleVerifyPhone}
                            className="px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap"
                          >
                            인증하기
                          </button>
                        </div>
                        {phoneTimer === 0 && (
                          <p className="text-xs text-red-600 mt-1">인증 시간이 만료되었습니다. 다시 요청해주세요.</p>
                        )}
                      </div>
                    )}

                    {/* 신분증/사업자등록증 업로드 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        신분증/사업자등록증
                      </label>
                      <input
                        ref={idCardInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e, "idCard")}
                        className="hidden"
                      />
                      <button 
                        onClick={() => idCardInputRef.current?.click()}
                        className="w-full h-[48px] border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-600 text-xs font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{uploadedFiles.idCard || "파일 선택"}</span>
                      </button>
                    </div>
                  </div>

                  {/* 입금 계좌 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-gray-900">
                        입금 계좌 <span className="text-red-500">*</span>
                      </label>
                      {!accountVerified ? (
                        <button
                          onClick={handleVerifyAccount}
                          disabled={!creatorInfo.accountBank || !creatorInfo.accountNumber}
                          className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          인증하기
                        </button>
                      ) : (
                        <div className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg">
                          인증완료!
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">
                      후원금을 받을 계좌를 등록해주세요.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={creatorInfo.accountBank}
                        onChange={(e) =>
                          setCreatorInfo({
                            ...creatorInfo,
                            accountBank: e.target.value,
                          })
                        }
                        disabled={accountVerified}
                        className="px-3 py-2.5 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 font-medium disabled:bg-gray-100"
                      >
                        <option value="">은행 선택</option>
                        <option value="KB국민">KB국민</option>
                        <option value="신한">신한</option>
                        <option value="우리">우리</option>
                        <option value="하나">하나</option>
                        <option value="농협은행">농협은행</option>
                        <option value="IBK기업">IBK기업</option>
                      </select>
                      <input
                        type="text"
                        value={creatorInfo.accountNumber}
                        onChange={(e) =>
                          setCreatorInfo({
                            ...creatorInfo,
                            accountNumber: e.target.value,
                          })
                        }
                        placeholder="계좌번호"
                        disabled={accountVerified}
                        className="px-3 py-2.5 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 font-medium placeholder:text-gray-400 disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* 세금 계산서 발행 정보 */}
                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-5">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">
                        세금 계산서 발행 정보
                      </h3>
                      <p className="text-xs text-gray-600">
                        정확한 정산 및 세무 처리를 위해 사업자 등록 정보를 정확히 입력해 주세요
                      </p>
                    </div>

                    {/* 사업자 구분 */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        사업자 구분 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="businessType"
                            value="individual"
                            checked={taxInfo.businessType === "individual"}
                            onChange={(e) =>
                              setTaxInfo({ ...taxInfo, businessType: e.target.value })
                            }
                            className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                          />
                          <span className="text-sm text-gray-900">개인 사업자</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="businessType"
                            value="corporation"
                            checked={taxInfo.businessType === "corporation"}
                            onChange={(e) =>
                              setTaxInfo({ ...taxInfo, businessType: e.target.value })
                            }
                            className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                          />
                          <span className="text-sm text-gray-900">법인 사업자</span>
                        </label>
                      </div>
                    </div>

                    {/* 상호명(법인명) */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        상호명(법인명) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={taxInfo.businessName}
                        onChange={(e) =>
                          setTaxInfo({ ...taxInfo, businessName: e.target.value })
                        }
                        placeholder="사업자 등록증상 정확한 명칭"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    {/* 사업자 등록번호 */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        사업자 등록번호 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={taxInfo.businessNumber}
                        onChange={(e) =>
                          setTaxInfo({ ...taxInfo, businessNumber: e.target.value.replace(/[^0-9]/g, '') })
                        }
                        placeholder="123-45-67890"
                        maxLength={12}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    {/* 대표자 성명 */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        대표자 성명 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={taxInfo.ceoName}
                        onChange={(e) =>
                          setTaxInfo({ ...taxInfo, ceoName: e.target.value })
                        }
                        placeholder="사업자 등록증상의 대표자 이름"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    {/* 사업장 소재지 */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        사업장 소재지 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={taxInfo.address}
                          onChange={(e) =>
                            setTaxInfo({ ...taxInfo, address: e.target.value })
                          }
                          placeholder="주소를 입력하거나 검색하세요"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 placeholder:text-gray-400"
                        />
                        <button className="px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap">
                          주소 검색
                        </button>
                      </div>
                    </div>

                    {/* 업태 및 종목 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          업태 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={taxInfo.businessCategory}
                          onChange={(e) =>
                            setTaxInfo({ ...taxInfo, businessCategory: e.target.value })
                          }
                          placeholder="예: 제조업"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          종목 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={taxInfo.businessItem}
                          onChange={(e) =>
                            setTaxInfo({ ...taxInfo, businessItem: e.target.value })
                          }
                          placeholder="예: 주류제조"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* 이메일 주소 */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        이메일 주소 <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-gray-600 mb-2">
                        전자세금계산서를 수령할 담당자 이메일
                      </p>
                      <input
                        type="email"
                        value={taxInfo.email}
                        onChange={(e) =>
                          setTaxInfo({ ...taxInfo, email: e.target.value })
                        }
                        placeholder="example@company.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    {/* 사업자 등록증 사본 업로드 */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        사업자 등록증 사본 <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={businessLicenseInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e, "businessLicense")}
                        className="hidden"
                      />
                      <button 
                        onClick={() => businessLicenseInputRef.current?.click()}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-600 text-sm font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        {uploadedFiles.businessLicense || "파일 선택"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 신뢰와 안전 */}
              {activeTab === "trust" && (
                <div className="space-y-6">
                  {/* 안내 메시지 */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-blue-900 mb-1">
                          전통주 펀딩의 특성을 후원자와 함께 나눠주세요
                        </p>
                        <p className="text-xs text-blue-800 leading-relaxed">
                          발효라는 자연스러운 과정의 매력과 변수를 솔직하게 공유하면, 
                          후원자들은 더 신뢰하며 함께 기다릴 수 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 주담 크라우드 펀딩 안내 (고정 표시) */}
                  <div className="space-y-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-base font-bold text-gray-900">
                      📌 주담 크라우드 펀딩 안내
                    </h3>
                    <p className="text-xs text-gray-500">
                      아래 내용은 모든 프로젝트에 자동으로 표시되는 안내문입니다.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-700 leading-relaxed mb-2">
                          <span className="font-bold text-black">후원은 '공동 기획'의 시작입니다</span>
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          주담의 후원은 이미 완성된 술을 사는 쇼핑이 아니라, 
                          여러분의 레시피 제안이 실제 제품으로 탄생하도록 양조장을 
                          지원하는 협업입니다. 따라서 전자상거래법상 단순 변심에 의한 
                          청약철회(7일 내 환불)가 적용되지 않습니다.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-white rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-700 leading-relaxed mb-2">
                          <span className="font-bold text-black">술은 살아있는 생물입니다</span>
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          전통주는 발효 과정에서 자연적인 변수가 발생할 수 있습니다. 
                          기획 의도를 최우선으로 하되, 발효가 주는 미세한 맛의 차이는 
                          전통주 펀딩만의 독특한 매력으로 이해해 주시길 부탁드립니다.
                        </p>
                      </div>
                    </div>
                    
                    {/* 주담 펀딩 알아보기 링크 */}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setShowFundingGuideModal(true)}
                        className="text-sm text-gray-700 hover:text-black font-medium inline-flex items-center gap-1 hover:underline transition-all"
                      >
                        🍶 주담의 펀딩 알아보기 (안내) →
                      </button>
                    </div>
                  </div>

                  {/* 프로젝트 정책 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      프로젝트 정책 <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-600 mb-3">
                      주류 특성과 후원자 보호를 위한 정책을 작성해주세요.
                    </p>
                    
                    {/* 가이드 */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3">
                      <p className="text-xs text-gray-700 leading-relaxed mb-2 font-semibold">
                        작성 가이드 (아래 항목을 참고하여 작성해주세요):
                      </p>
                      <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4">
                        <li>
                          <span className="font-semibold text-gray-700">주류 배송 특성:</span> 
                          파손 위험이 높은 유리병 제품의 안전 배송 약속 및 파손 시 교환 절차를 작성해주세요.
                        </li>
                        <li>
                          <span className="font-semibold text-gray-700">성인 인증 안내:</span> 
                          전통주 온라인 판매 규정에 따른 성인 인증 및 수령 절차를 명시해주세요.
                        </li>
                        <li>
                          <span className="font-semibold text-gray-700">환불 정책:</span> 
                          재료 수급 및 양조 시작 후의 환불 불가 조건과, 양조장 과실로 인한 
                          생산 무산 시 환불 이행 약속을 적어주세요.
                        </li>
                      </ul>
                    </div>
                    
                    <textarea
                      value={trustInfo.projectPolicy}
                      onChange={(e) =>
                        setTrustInfo({
                          ...trustInfo,
                          projectPolicy: e.target.value,
                        })
                      }
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 leading-relaxed resize-none"
                    />
                  </div>

                  {/* 예상되는 어려움 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                      예상되는 어려움 <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-600 mb-3">
                      전통주 제조 과정에서 발생할 수 있는 자연스러운 변수를 솔직하게 공유해주세요.
                    </p>
                    
                    {/* 가이드 */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3">
                      <p className="text-xs text-gray-700 leading-relaxed mb-2 font-semibold">
                        작성 가이드 (아래 항목을 참고하여 작성해주세요):
                      </p>
                      <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4">
                        <li>
                          <span className="font-semibold text-gray-700">발효의 변수:</span> 
                          기온이나 효모 활동에 따른 미세한 맛의 차이(단맛/산미 등) 가능성을 
                          솔직하게 공유해주세요.
                        </li>
                        <li>
                          <span className="font-semibold text-gray-700">일정 지연:</span> 
                          최상의 발효 상태를 위해 출고가 1~2주 지연될 수 있는 상황과 
                          대응 방안을 작성해주세요.
                        </li>
                        <li>
                          <span className="font-semibold text-gray-700">원재료 수급:</span> 
                          지역 농산물 수급 상황에 따른 생산 일정 변동 가능성을 언급해주세요.
                        </li>
                      </ul>
                    </div>
                    
                    <textarea
                      value={trustInfo.expectedDifficulties}
                      onChange={(e) =>
                        setTrustInfo({
                          ...trustInfo,
                          expectedDifficulties: e.target.value,
                        })
                      }
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-900 leading-relaxed resize-none"
                    />
                  </div>
                </div>
              )}

              {/* 인증 서류 */}
              {activeTab === "verification" && (
                <div className="space-y-6">
                  {/* 필수 서류 안내 */}
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-red-900 mb-1">
                          전통주 필수 서류
                        </p>
                        <p className="text-xs text-red-800 leading-relaxed">
                          주류의 통신판매에 관한 명령위임 고시에 의거하여 아래
                          서류를 반드시 제출해주셔야 합니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 서류 업로드 */}
                  <div className="space-y-4">
                    {/* 통신판매신고증 */}
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                            통신판매신고증 <span className="text-red-500">*</span>
                          </h3>
                          <p className="text-xs text-gray-600">사업자의 통신판매신고증</p>
                        </div>
                        <FileCheck className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        ref={salesPermitInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e, "salesPermit")}
                        className="hidden"
                      />
                      <button 
                        onClick={() => salesPermitInputRef.current?.click()}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-600 text-sm"
                      >
                        <Upload className="w-4 h-4" />
                        <span className="font-medium">{uploadedFiles.salesPermit || "파일 선택"}</span>
                      </button>
                    </div>

                    {/* 주류 통신판�� 승인서 */}
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                            주류 통신판매 승인(신청)서 <span className="text-red-500">*</span>
                          </h3>
                          <p className="text-xs text-gray-600">주류 통신판매 승인서</p>
                        </div>
                        <FileCheck className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        ref={alcoholPermitInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e, "alcoholPermit")}
                        className="hidden"
                      />
                      <button 
                        onClick={() => alcoholPermitInputRef.current?.click()}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-600 text-sm"
                      >
                        <Upload className="w-4 h-4" />
                        <span className="font-medium">{uploadedFiles.alcoholPermit || "파일 선택"}</span>
                      </button>
                    </div>

                    {/* 전통주 제조면허증 */}
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                            전통주 제조면허증 <span className="text-red-500">*</span>
                          </h3>
                          <p className="text-xs text-gray-600">전통주 제조 면허증</p>
                        </div>
                        <FileCheck className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        ref={manufacturingLicenseInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e, "manufacturingLicense")}
                        className="hidden"
                      />
                      <button 
                        onClick={() => manufacturingLicenseInputRef.current?.click()}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-600 text-sm"
                      >
                        <Upload className="w-4 h-4" />
                        <span className="font-medium">{uploadedFiles.manufacturingLicense || "파일 선택"}</span>
                      </button>
                    </div>
                  </div>

                  {/* 주의사항 */}
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-900 leading-relaxed">
                      📌 서류 심사는 3-5일 소요됩니다.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-[60px] left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 h-14 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all text-base disabled:opacity-50"
          >
            {isSaving ? "저장 중..." : "임시저장"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || calculateProgress() < 100}
            className="flex-1 h-14 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "제출 중..." : "제출"}
          </button>
        </div>
      </div>

      {/* CSS for hiding scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* 제출 확인 모달 */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <>
            {/* 오버레이 - 모바일 크기만 어둡게 */}
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSubmitConfirm(false)}
                className="w-full max-w-[430px] h-full bg-black/50"
              />
            </div>

            {/* 모달 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl p-6 z-50 shadow-xl"
            >
              <h3 className="text-lg font-bold text-black mb-3 text-center">
                제출 하시겠습니까?
              </h3>
              <p className="text-sm text-gray-600 mb-6 text-center">
                제출 후에는 수정이 불가능합니다.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                >
                  아니요
                </button>
                <button
                  onClick={confirmSubmit}
                  className="flex-1 h-12 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all"
                >
                  예
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 제출 성공 모달 */}
      <AnimatePresence>
        {showSubmitSuccess && (
          <>
            {/* 오버레이 - 모바일 크기만 어둡게 */}
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-[430px] h-full bg-black/50"
              />
            </div>

            {/* 모달 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl p-8 z-50 shadow-xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">
                  성공적으로 업로드 되었습니다
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  심사는 3-5영업일이 소요됩니다.
                </p>
                <button
                  onClick={handleSubmitSuccessClose}
                  className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 임시저장 모달 */}
      <AnimatePresence>
        {showTempSaveModal && (
          <>
            {/* 오버레이 - 모바일 크기만 어둡게 */}
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-[430px] h-full bg-black/50"
                onClick={() => setShowTempSaveModal(false)}
              />
            </div>

            {/* 모달 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl p-6 z-50 shadow-xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  임시 저장된 작성 내용
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {tempSaveTimestamp && new Date(tempSaveTimestamp).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}에 저장됨
                </p>
                <div className="space-y-3">
                  <button
                    onClick={loadFromLocalStorage}
                    className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all"
                  >
                    불러오기
                  </button>
                  <button
                    onClick={deleteTempSave}
                    className="w-full h-12 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-all"
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => setShowTempSaveModal(false)}
                    className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                  >
                    취소
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Alert 모달 */}
      <AnimatePresence>
        {showAlertModal && (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-[430px] h-full bg-black/50"
                onClick={() => setShowAlertModal(false)}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl p-8 z-50 shadow-xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">
                  알림
                </h3>
                <p className="text-sm text-gray-600 mb-6 whitespace-pre-wrap">
                  {alertMessage}
                </p>
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 미리보기 모달 - 전체 화��� */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-50 z-50 flex flex-col left-1/2 -translate-x-1/2 max-w-[430px]"
          >
            {/* 헤더 */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-black" />
                </button>
              </div>
            </div>

            {/* 미리보기 콘텐츠 - 스크롤 가능 */}
            <div className="flex-1 overflow-y-auto pb-20">
              {/* 메인 이미지 */}
              <section className="relative w-full h-64 bg-gray-200">
                {basicInfo.images[0] ? (
                  <img
                    src={basicInfo.images[0]}
                    alt={basicInfo.title || "프로젝트"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </section>

              {/* 콘텐츠 영역 */}
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {/* 제목과 한줄 소개 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 mb-6"
                >
                  <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3 leading-tight">
                    {basicInfo.title || "프로젝트 제목을 입력해주세요"}
                  </h1>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {basicInfo.summary || "프로젝트 요약을 입력해주세요"}
                  </p>
                </motion.div>

                {/* 펀딩 진행 현황 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
                >
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-black">0%</p>
                      <p className="text-xs text-gray-500 mt-1">달성률</p>
                    </div>
                    <div className="text-center border-l border-r border-gray-200">
                      <p className="text-2xl font-bold text-black">
                        {fundingInfo.goalAmount ? (Number(fundingInfo.goalAmount) / 10000).toLocaleString() : '0'}
                        <span className="text-base">만원</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">목표금액</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-black">0</p>
                      <p className="text-xs text-gray-500 mt-1">후원자</p>
                    </div>
                  </div>

                  <Progress
                    value={0}
                    className="h-2 bg-gray-100 mb-4"
                    indicatorClassName="bg-gradient-to-r from-gray-800 to-black"
                  />

                  <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">
                        {fundingInfo.duration}일 진행 예정
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 pl-5">
                      {fundingInfo.startDate || "시작일 미정"}
                    </span>
                  </div>
                </motion.div>

                {/* 양조장 프로필 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {creatorInfo.profileImage ? (
                        <img
                          src={creatorInfo.profileImage}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold text-black">{creatorInfo.name || "양조장 이름"}</p>
                      <p className="text-xs text-gray-500">{basicInfo.category || "카테고리"}</p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-semibold">
                      양조장
                    </span>
                  </div>
                </motion.div>

                {/* 프로젝트 소개 섹션 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-12"
                >
                  <div className="space-y-6">
                    {/* 프로젝트 소개 */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-black mb-4">
                        프로젝트 소개
                      </h2>
                      
                      {/* 재료 및 도수 정보 */}
                      {(basicInfo.mainIngredient || basicInfo.subIngredient || productInfo.alcoholContent) && (
                        <div className="mb-6 grid grid-cols-1 gap-3">
                          {(basicInfo.mainIngredient || basicInfo.subIngredient) && (
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                              <div className="grid grid-cols-2 gap-4">
                                {basicInfo.mainIngredient && (
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">메인재료</p>
                                    <p className="text-sm font-semibold text-black">{basicInfo.mainIngredient}</p>
                                  </div>
                                )}
                                {basicInfo.subIngredient && (
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">서브재료</p>
                                    <p className="text-sm font-semibold text-black">{basicInfo.subIngredient}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {productInfo.alcoholContent && (
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">도수</p>
                              <p className="text-sm font-semibold text-black">{productInfo.alcoholContent}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 프로젝트 요약 */}
                      {basicInfo.summary && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <h3 className="text-sm font-bold text-blue-900 mb-2">📝 프로젝트 요약</h3>
                          <p className="text-sm text-blue-900 leading-relaxed">
                            {basicInfo.summary}
                          </p>
                        </div>
                      )}

                      {/* 프로젝트 상세 소개 */}
                      {projectPlan.introduction && (
                        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
                          <p className="whitespace-pre-wrap">{projectPlan.introduction}</p>
                        </div>
                      )}
                    </div>

                    {/* 가격 안내 */}
                    {(fundingInfo.pricePerBottle || fundingInfo.bottleQuantity || fundingInfo.goalAmount) && (
                      <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-black mb-6">
                          가격 안내
                        </h2>
                        <div className="space-y-3">
                          {/* 병당 단가 */}
                          {fundingInfo.pricePerBottle && (
                            <div className="relative overflow-hidden rounded-2xl border border-gray-200">
                              <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
                              <div className="p-5 pl-6">
                                <div className="flex items-end justify-between">
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1.5">병당 단가</p>
                                    <p className="text-3xl font-bold text-black tracking-tight">
                                      {Number(fundingInfo.pricePerBottle).toLocaleString()}
                                      <span className="text-xl ml-0.5">원</span>
                                    </p>
                                  </div>
                                  {productInfo.volume && (
                                    <div className="text-right">
                                      <p className="text-sm text-gray-600">{productInfo.volume}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 총 판매 수량 */}
                          {fundingInfo.bottleQuantity && (
                            <div className="relative overflow-hidden rounded-2xl border border-gray-200">
                              <div className="absolute top-0 left-0 w-1 h-full bg-gray-300"></div>
                              <div className="p-5 pl-6">
                                <div className="flex items-end justify-between">
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1.5">총 판매 수량</p>
                                    <p className="text-3xl font-bold text-black tracking-tight">
                                      {Number(fundingInfo.bottleQuantity).toLocaleString()}
                                      <span className="text-xl ml-0.5">병</span>
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">목표 수량</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 목표 금액 */}
                          {fundingInfo.goalAmount && (
                            <div className="mt-4 p-4 bg-gray-900 rounded-2xl">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-300">펀딩 목표 금액</p>
                                <p className="text-lg font-bold text-white">
                                  {Number(fundingInfo.goalAmount).toLocaleString()}원
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 프로젝트 예산 */}
                    {projectPlan.budget && (
                      <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-black mb-4">
                          프로젝트 예산
                        </h2>
                        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                          <p className="whitespace-pre-wrap">{projectPlan.budget}</p>
                        </div>
                      </div>
                    )}

                    {/* 프로젝트 일정 */}
                    {projectPlan.schedule && (
                      <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-black mb-4">
                          프로젝트 일정
                        </h2>
                        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                          <p className="whitespace-pre-wrap">{projectPlan.schedule}</p>
                        </div>
                      </div>
                    )}

                    {/* 맛 지표 */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-black mb-4">
                        맛 지표
                      </h2>
                      <p className="text-sm text-gray-600 mb-6">
                        양조장이 예상하는 이 전통주의 맛 프로필입니다.
                      </p>
                      
                      {/* 레이더 차트 */}
                      <div className="flex justify-center mb-6">
                        <div className="w-full max-w-sm">
                          <svg viewBox="0 0 400 400" className="w-full h-auto">
                            {/* 배경 오각형 그리드 */}
                            {[1, 0.75, 0.5, 0.25].map((scale) => (
                              <polygon
                                key={scale}
                                points={[
                                  [200, 200 - 150 * scale],
                                  [200 + 142.5 * scale, 200 - 46.35 * scale],
                                  [200 + 88.1 * scale, 200 + 121.35 * scale],
                                  [200 - 88.1 * scale, 200 + 121.35 * scale],
                                  [200 - 142.5 * scale, 200 - 46.35 * scale],
                                ].map(p => p.join(',')).join(' ')}
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="1"
                              />
                            ))}
                            
                            {/* 축선 */}
                            {[
                              [200, 50],
                              [342.5, 153.65],
                              [288.1, 321.35],
                              [111.9, 321.35],
                              [57.5, 153.65],
                            ].map((point, i) => (
                              <line
                                key={i}
                                x1="200"
                                y1="200"
                                x2={point[0]}
                                y2={point[1]}
                                stroke="#e5e7eb"
                                strokeWidth="1"
                              />
                            ))}

                            {/* 데이터 폴리곤 */}
                            <polygon
                              points={[
                                [200, 200 - (tasteProfile.sweetness / 100) * 150],
                                [200 + (tasteProfile.aroma / 100) * 142.5, 200 - (tasteProfile.aroma / 100) * 46.35],
                                [200 + (tasteProfile.acidity / 100) * 88.1, 200 + (tasteProfile.acidity / 100) * 121.35],
                                [200 - (tasteProfile.body / 100) * 88.1, 200 + (tasteProfile.body / 100) * 121.35],
                                [200 - (tasteProfile.carbonation / 100) * 142.5, 200 - (tasteProfile.carbonation / 100) * 46.35],
                              ].map(p => p.join(',')).join(' ')}
                              fill="rgba(0, 0, 0, 0.2)"
                              stroke="rgba(0, 0, 0, 0.8)"
                              strokeWidth="2"
                            />

                            {/* 데이터 포인트 */}
                            {[
                              { x: 200, y: 200 - (tasteProfile.sweetness / 100) * 150 },
                              { x: 200 + (tasteProfile.aroma / 100) * 142.5, y: 200 - (tasteProfile.aroma / 100) * 46.35 },
                              { x: 200 + (tasteProfile.acidity / 100) * 88.1, y: 200 + (tasteProfile.acidity / 100) * 121.35 },
                              { x: 200 - (tasteProfile.body / 100) * 88.1, y: 200 + (tasteProfile.body / 100) * 121.35 },
                              { x: 200 - (tasteProfile.carbonation / 100) * 142.5, y: 200 - (tasteProfile.carbonation / 100) * 46.35 },
                            ].map((point, i) => (
                              <circle
                                key={i}
                                cx={point.x}
                                cy={point.y}
                                r="4"
                                fill="black"
                              />
                            ))}

                            {/* 레이블 */}
                            <text x="200" y="35" textAnchor="middle" className="text-xs font-bold" fill="#374151">단맛</text>
                            <text x="360" y="158" textAnchor="start" className="text-xs font-bold" fill="#374151">잔향</text>
                            <text x="295" y="345" textAnchor="start" className="text-xs font-bold" fill="#374151">산미</text>
                            <text x="105" y="345" textAnchor="end" className="text-xs font-bold" fill="#374151">바디감</text>
                            <text x="40" y="158" textAnchor="end" className="text-xs font-bold" fill="#374151">탄산감</text>
                          </svg>
                        </div>
                      </div>

                      {/* 맛 지표 수치 */}
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "단맛", value: tasteProfile.sweetness },
                          { label: "잔향", value: tasteProfile.aroma },
                          { label: "산미", value: tasteProfile.acidity },
                          { label: "바디감", value: tasteProfile.body },
                          { label: "탄산감", value: tasteProfile.carbonation },
                        ].map((taste) => (
                          <div key={taste.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-semibold text-gray-700">{taste.label}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gray-900 rounded-full"
                                  style={{ width: `${taste.value}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-gray-900 w-10 text-right">
                                {taste.value}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 안내사항 */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-black mb-6">
                        안내사항
                      </h2>
                      
                      {/* 크라우드 펀딩에 대한 안내 */}
                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-black mb-4">
                          📌 주담 크라우드 펀딩 안내
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-sm text-gray-700 leading-relaxed mb-2">
                              <span className="font-bold text-black">후원은 '공동 기획'의 시작입니다</span>
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              주담의 후원은 이미 완성된 술을 사는 쇼핑이 아니라, 
                              여러분의 레시피 제안이 실제 제품으로 탄생하도록 양조장을 
                              지원하는 협업입니다. 따라서 전자상거래법상 단순 변심에 의한 
                              청약철회(7일 내 환불)가 적용되지 않습니다.
                            </p>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-sm text-gray-700 leading-relaxed mb-2">
                              <span className="font-bold text-black">술은 살아있는 생물입니다</span>
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              전통주는 발효 과정에서 자연적인 변수가 발생할 수 있습니다. 
                              기획 의도를 최우선으로 하되, 발효가 주는 미세한 맛의 차이는 
                              전통주 펀딩만의 독특한 매력으로 이해해 주시길 부탁드립니다.
                            </p>
                          </div>
                        </div>
                        
                        {/* 주담 펀딩 알아보기 링크 */}
                        <div className="mt-4">
                          <button
                            onClick={() => setShowFundingGuideModal(true)}
                            className="text-sm text-gray-700 hover:text-black font-medium inline-flex items-center gap-1 hover:underline transition-all"
                          >
                            🍶 주담의 펀딩 알아보기 (안내) →
                          </button>
                        </div>
                      </div>

                      {/* 프로젝트 정책 */}
                      <div className="mb-8 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-bold text-black mb-4">
                          📄 프로젝트 정책
                        </h3>
                        
                        <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="whitespace-pre-wrap">{trustInfo.projectPolicy}</p>
                          </div>
                        </div>
                      </div>

                      {/* 예상되는 어려움 */}
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-bold text-black mb-4">
                          ⚠️ 예상되는 어려움
                        </h3>
                        
                        <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="whitespace-pre-wrap">{trustInfo.expectedDifficulties}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 나가기 확인 다이얼로그 */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowExitConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  임시 저장을 하지 않으셨습니다
                </h3>
                <p className="text-sm text-gray-600">
                  작성 중인 내용을 임시 저장하시겠습니까?
                </p>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleSaveAndExit}
                  className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  네, 저장하고 나가기
                </button>
                <button
                  onClick={handleExitWithoutSave}
                  className="w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  아니오, 저장 안함
                </button>
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="w-full py-3 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  계속 작성하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 주담 펀딩 알아보기 모달 */}
      <AnimatePresence>
        {showFundingGuideModal && (
          <>
            {/* 오버레이 - 모바일 크기만 어둡게 */}
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFundingGuideModal(false)}
                className="w-full max-w-[430px] h-full bg-black/50"
              />
            </div>
            
            {/* 모달 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-full max-w-md z-50 px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
                {/* 헤더 */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-black">
                      🍶 주담 펀딩 안내
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowFundingGuideModal(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-2xl text-gray-500">×</span>
                    </button>
                  </div>
                </div>

                {/* 내용 */}
                <div className="p-6 space-y-6">
                  {/* 주담 펀딩이란 */}
                  <div>
                    <h3 className="text-lg font-bold text-black mb-3">
                      주담 펀딩이란 무엇이죠?
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      주담 펀딩은 혁신적인 전통주 레시피 아이디어를 가진 <span className="font-bold">개인(기획자)</span>과 
                      이를 실제 술로 빚어낼 수 있는 전문 양조장이 만나, 다수의 후원자와 함께 새로운 우리 술을 
                      탄생시키는 과정입��다.
                    </p>
                  </div>

                  {/* 진행 방식 */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-black mb-3">
                      주담 펀딩은 어떤 방식으로 진행되나요?
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      주담 펀딩은 기획자와 양조장, 그리고 후원자가 함께 <span className="font-bold">'세상에 없던 나만의 술'</span>을 
                      완성해 나가는 협업 프로젝트입니다.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-bold text-black mb-2">
                          기획자 및 양조장:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          AI 검토를 거친 레시피를 바탕으로 프로젝트를 개설하여 제조에 필요한 예산을 모금합니다. 
                          펀딩에 성공하면 약속한 전통주를 정성껏 빚어 후원자에게 전달합니다.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-bold text-black mb-2">
                          후원자:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          자신의 취향에 맞는 레시피 프로젝트에 후원하며 공동 기획자로 참여합니다. 
                          펀딩 성공 시, 숙성 기간을 거쳐 완성된 나만의 전통주를 리워드로 받아보실 수 있습니다.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-bold text-black mb-2">
                          소통의 의무:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          전통주는 발효 식품 특성상 기상 조건이나 효모의 활동에 따라 일정이 지연되거나 
                          풍미가 미세하게 변할 수 있습니다. 양조장은 이러한 변동 사항을 후원자에게 즉시 알리고 
                          성실히 설명할 의무가 있습니다.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-sm font-bold text-blue-900 mb-2">
                          결제 안내:
                        </p>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          펀딩은 목표 금액에 도달했을 때만 성사되며, 목표 미달 시 프로젝트는 무산되고 
                          결제는 진행되지 않습니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 후원이란 */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-black mb-3">
                      후원이란 무엇인가요?
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      주담에서의 ��원은 단순히 만들어진 술을 구매하�� '전자상거래'가 아닙니다.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-bold text-black mb-2">
                          가치의 지지:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          아직 세상에 나오지 않은 전통주 레시피가 실현될 수 있도록 자금을 지원하고 응원하는 일입니다. 
                          그 보답으로 양조 전문가가 완성한 고품질의 전통주를 리워드로 제공받습니다.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-bold text-black mb-2">
                          변수의 수용:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          발효와 숙성이라는 자연의 공정을 거치므로, 안내된 일정보다 조금 늦어지거나 
                          맛의 밸런스가 전문가의 보정 과정에서 일부 조정될 수 있음을 이해해 주셔야 합니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 주담의 역할 */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-black mb-3">
                      주담은 이 과정에서 무엇을 하나요?
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      주담은 사용자의 아이디어가 안전하게 제품화될 수 있도록 신뢰의 연결고리 역할을 합니다.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-bold text-black mb-2">
                          AI 레시피 검토:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          실현 불가능하거나 주세법에 어긋나는 레시피를 AI가 1차적으로 필터링하여 
                          안전한 프로젝트만 소개합니다.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-bold text-black mb-2">
                          투명한 공정 공유:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          양조 일지를 통해 원료 입고부터 포장까지의 전 과정을 시각화하여 정보의 격차를 해소합니다.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-sm font-bold text-red-900 mb-2">
                          커뮤니티 관리:
                        </p>
                        <p className="text-sm text-red-800 leading-relaxed">
                          이용약관과 전통주 판매 규정을 준수하지 않거나, 후원자와의 소통을 소홀히 하여 
                          피해를 주는 이용자 및 양조장에게는 주의·경고 및 서비스 이용 제한 등의 
                          엄격한 조치를 취하고 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
                  <button
                    type="button"
                    onClick={() => setShowFundingGuideModal(false)}
                    className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-bold transition-colors"
                  >
                    확인
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}