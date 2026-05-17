# JUDAM Backend API Memo

이 파일은 백엔드가 전달한 API PDF 명세를 프론트 개발자가 바로 찾아볼 수 있도록 정리한 보조 문서다.

작업 규칙:
- API 관련 코드를 수정하기 전에는 반드시 `judam.md`와 이 `api.md`를 함께 확인한다.
- 서버 주소(`baseURI`)가 아직 확정되지 않은 API는 실제 호출 코드를 만들지 않고 연결 대기 상태로 둔다.
- 로그인/회원가입 API 연결 후 `access_token` 저장 위치가 정해지면 인증 API에 `Authorization: Bearer {access_token}` 헤더를 붙인다.
- 명세가 현재 화면 UI와 맞지 않거나 필드가 부족하면 바로 코드를 수정하지 않고 사용자에게 먼저 질문한다.
- 2026-05-10 이후 펀딩 API 연결은 사용자가 명확히 요청한 `[펀딩]` 범위로만 진행한다. 사용자가 별도로 UI 수정을 요청하지 않는 한 UI/디자인/화면 플로우는 건드리지 않고 API client, mapper, state 연동, 에러/로딩 처리만 수정한다.
- 펀딩 API는 PR 단위로 쪼개 연결한다. 1차 PR은 펀딩 생성 시작 흐름만 다루며, 약관 동의 저장, 펀딩 프로젝트 임시저장, 임시저장 프로젝트 수정만 포함한다.
- 이 문서는 백엔드 내부 구현을 수정하기 위한 문서가 아니라 React Native/Expo 프론트 연결용 메모다.

## Funding API PR Plan

현재 사용자가 정한 펀딩 API 연결 순서다. 추후 백엔드 명세가 더 구체화되면 각 PR 아래에 endpoint, request/response, frontend mapping을 추가한다.

### 1차 PR: 펀딩 생성 시작 단계
- 펀딩 약관 동의 저장
- 펀딩 프로젝트 임시저장
- 임시저장 프로젝트 수정
- 여기까지 연결 후 PR을 끊는다.

### 2차 PR: 펀딩 기본 정보 입력 단계
- 프로젝트 기본 정보 저장
- 목표 금액 및 일정 저장
- 법적 고시 정보 저장

### 3차 PR: 펀딩 상세 정보 확장
- 맛 지표 저장
- 프로젝트 계획 정보 저장
- 창작자/정산 정보 저장
- 환불/정책 관련 저장

### 4차 PR: 파일 + 검증
- 필수 서류 업로드: connected on 2026-05-10

### 5차 PR: 조회 API
- 펀딩 프로젝트 목록 조회
- 상세 조회
- 프로젝트 소개 조회
- 양조일지 조회

### 6차 PR: 커뮤니티 + 상호작용
- Q&A 목록 조회
- 질문 등록
- 답글 등록
- 후기 조회

### 7차 PR: 결제 / 후원
- 후원 옵션 조회
- 주문 생성
- 결제 요청
- 주문 상세 조회

## Common

Base URL:
- Current server: `http://43.202.24.223:3000`
- The server is usage-billed. Avoid unnecessary manual API calls during verification.
- Frontend constants:
  - Recipe: `src/features/recipe/api.ts`의 `JUDAM_API_BASE_URL`
  - Funding: `src/features/funding/api.ts`의 `JUDAM_FUNDING_API_BASE_URL`

Headers:
```http
Content-Type: application/json
Authorization: Bearer {access_token}
```

Auth rules:
- `Authorization`은 로그인 사용자 API에서 필수다.
- 레시피 목록/상세/댓글 목록은 비로그인 접근 가능하며, 이 경우 `Authorization` 생략 가능하다.
- 비로그인 접근 가능 API라도 로그인 상태에서는 토큰을 붙여 `is_liked` 같은 사용자별 값을 받을 수 있다.

Pagination:
- `page`: 0부터 시작, 기본값 0
- `size`: 기본값 20

Common error body:
```json
{
  "status": 500,
  "message": "서버 내부 오류"
}
```

## Community Post APIs

Source PDFs:
- `5a518311-0c63-45bb-9029-e39115dbf59d_게시글_작성.pdf`
- `98c61173-ead6-4d1e-858a-12f18a420d05_게시글_목록_조회.pdf`
- `6d5e2b3b-b7ad-438e-8d63-dd352fdbc38e_게시글_상세_조회.pdf`
- `a559f6ec-2508-4f2f-a048-bcd470d53335_게시글_수정.pdf`
- `24f65445-e946-495b-8fb4-dabaaf256e55_게시글_삭제.pdf`
- `7b5b5dc3-5590-497f-96e3-13e956b29eab_게시글_좋아요_등록.pdf`
- `4a6fd0fb-830c-4d84-809e-d04641ccca92_게시글_좋아요_취소.pdf`
- `ed40016b-75b5-47c0-a7a7-44f03d769a8b_게시글_댓글_목록_조회.pdf`
- `668fa391-e36d-4e9b-85f8-a9f542d21238_게시글_댓글_작성.pdf`
- `4f703c5e-b60b-4119-b3c7-39184105ac26_게시글_댓글_수정.pdf`
- `b71fb3c8-4b85-4c1c-8574-b810d8e4db44_게시글_댓글_삭제.pdf`
- `1fba1f2f-e654-439b-9d96-26530ce9c2cc_게시글_댓글_좋아요_등록.pdf`
- `7341842d-95eb-4649-b8fb-231e598ef705_게시글_댓글_좋아요_취소.pdf`

Base:
- Same current server: `http://43.202.24.223:3000`
- Endpoint prefix: `{baseURI}/api/posts`
- Public read APIs may omit `Authorization`.
- Authenticated read APIs may include `Authorization: Bearer {access_token}` to receive user-specific fields such as `is_liked`.
- Write, update, delete, like, and comment mutation APIs require `Authorization: Bearer {access_token}`.

Board types:
- `ALL`: list filter only. Default when omitted.
- `FREE`: 자유게시판.
- `TASTING_REVIEW`: 시음 후기.
- `RECIPE_DISCUSSION`: 레시피 토론.
- `board_type` is required on create and cannot be changed on update.

### Community Post Create

Endpoint:
```http
POST {baseURI}/api/posts
```

Access:
- Login required.
- `Authorization: Bearer {access_token}` required.

Request:
- Body: `multipart/form-data`
- Do not manually set `Content-Type`; the runtime must set the multipart boundary.

```ts
type CreateCommunityPostFormData = {
  title: string;
  content: string;
  board_type: "FREE" | "TASTING_REVIEW" | "RECIPE_DISCUSSION";
  images?: File[]; // same form field name repeated, max 5
};
```

Response:
```ts
type CreateCommunityPostResponse = {
  status: 201;
  message: string;
  post: {
    post_id: number;
    title: string;
    board_type: "FREE" | "TASTING_REVIEW" | "RECIPE_DISCUSSION";
    user_id: number;
    nickname: string;
    like_count: 0;
    comment_count: 0;
    image_urls: string[];
    created_at: string;
  };
};
```

Notes:
- Images are sent as files, not URLs. Backend uploads them to S3 and stores returned URLs in `POST_IMAGES`.
- Maximum image count is 5.
- React Native should append each image as `{ uri, name, type }` using the repeated field name `images`.
- Initial `like_count` and `comment_count` are `0`.

Errors:
- `400`: required field missing.
- `400`: images exceed 5.
- `400`: invalid `board_type`.
- `401`: invalid or expired token.
- `500`: server error.

### Community Post List

Endpoint:
```http
GET {baseURI}/api/posts
```

Access:
- Public.
- `Authorization` optional.

Query:
- `board_type`: `ALL` default, `FREE`, `TASTING_REVIEW`, `RECIPE_DISCUSSION`
- `sort`: `newest` default, `popular`
- `page`: default `0`
- `size`: default `20`

Response:
```ts
type CommunityPostListResponse = {
  posts: Array<{
    post_id: number;
    title: string;
    board_type: "FREE" | "TASTING_REVIEW" | "RECIPE_DISCUSSION";
    user_id: number;
    nickname: string;
    like_count: number;
    comment_count: number;
    thumbnail_url: string | null;
    created_at: string;
  }>;
  totalElements: number;
  totalPages: number;
  currentPage: number;
};
```

Notes:
- `sort=popular` sorts by `like_count DESC`.
- `thumbnail_url` is the first image URL for the post, or `null`.
- List response intentionally excludes `content`.

Missing for current app UI:
- The list response does not include `is_liked`, so heart state on cards cannot be hydrated from the list alone.
- The list response does not include author profile image.

### Community Post Detail

Endpoint:
```http
GET {baseURI}/api/posts/{postId}
```

Access:
- Public.
- `Authorization` optional; if omitted, `is_liked` is `false`.

Path:
- `postId`: community post id.

Response:
```ts
type CommunityPostDetailResponse = {
  post: {
    post_id: number;
    title: string;
    content: string;
    board_type: "FREE" | "TASTING_REVIEW" | "RECIPE_DISCUSSION";
    user_id: number;
    nickname: string;
    like_count: number;
    comment_count: number;
    is_liked: boolean;
    image_urls: string[];
    created_at: string;
    updated_at: string | null;
  };
};
```

Notes:
- `image_urls` are ordered by `POST_IMAGES.sequence ASC`.
- `is_liked` is computed from `POST_LIKES(user_id, post_id)` when logged in.

Errors:
- `404`: post not found.
- `500`: server error.

### Community Post Update

Endpoint:
```http
PUT {baseURI}/api/posts/{postId}
```

Access:
- Login required.
- Only the author can update.

Request:
```ts
type UpdateCommunityPostRequest = {
  title: string;
  content: string;
  image_urls: string[]; // complete replacement list, max 5
};
```

Response:
```ts
type UpdateCommunityPostResponse = {
  status: 200;
  message: string;
  post: {
    post_id: number;
    title: string;
    content: string;
    image_urls: string[];
    updated_at: string;
  };
};
```

Notes:
- `board_type` cannot be updated.
- Existing `POST_IMAGES` rows are deleted and recreated from `image_urls`.
- This update API accepts existing image URLs, not new multipart files. If the frontend needs to add newly selected local images during edit, a separate upload path or multipart update spec is still needed.

Errors:
- `400`: required field missing.
- `401`: invalid or expired token.
- `403`: not the author.
- `404`: post not found.
- `500`: server error.

### Community Post Delete

Endpoint:
```http
DELETE {baseURI}/api/posts/{postId}
```

Access:
- Login required.
- Only the author can delete.

Response:
```ts
type DeleteCommunityPostResponse = {
  status: 200;
  message: string;
};
```

Notes:
- Backend deletes related `POST_IMAGES`, `COMMENTS`, and `POST_LIKES` by cascade or explicit deletion.

Errors:
- `401`: invalid or expired token.
- `403`: not the author.
- `404`: post not found.
- `500`: server error.

### Community Post Likes

Register:
```http
POST {baseURI}/api/posts/{postId}/likes
```

Cancel:
```http
DELETE {baseURI}/api/posts/{postId}/likes
```

Access:
- Login required.

Response:
```ts
type CommunityPostLikeResponse = {
  status: 200;
  message: string;
  data: {
    post_id: number;
    like_count: number;
  };
};
```

Notes:
- `POST_LIKES(post_id, user_id)` has a unique constraint to prevent duplicates.
- Register increments `POSTS.like_count`.
- Cancel deletes the matching `POST_LIKES` row and decrements `POSTS.like_count`, clamped at `0`.

Errors:
- `400`: duplicate like, or no existing like history on cancel.
- `401`: invalid or expired token.
- `404`: post not found.
- `500`: server error.

### Community Post Comment List

Endpoint:
```http
GET {baseURI}/api/posts/{postId}/comments
```

Access:
- Public.
- `Authorization` optional; if omitted, `is_liked` is `false`.

Query:
- `page`: default `0`
- `size`: default `20`

Response:
```ts
type CommunityPostCommentListResponse = {
  comments: Array<{
    comment_id: number;
    user_id: number;
    nickname: string;
    content: string;
    like_count: number;
    is_liked: boolean;
    created_at: string;
    updated_at: string | null;
  }>;
  totalElements: number;
  totalPages: number;
  currentPage: number;
};
```

Notes:
- Sorted by `created_at ASC`, oldest comments first.
- `is_liked` is computed from `POST_COMMENT_LIKES(user_id, comment_id)` when logged in.

Missing for current app UI:
- No `is_mine` field is provided, so frontend must compare `user_id` with current user id or ask backend to add `is_mine`.
- No author profile image or author type is provided.
- No reply/nested comment API is included in these PDFs.

Errors:
- `404`: post not found.
- `500`: server error.

### Community Post Comment Create

Endpoint:
```http
POST {baseURI}/api/posts/{postId}/comments
```

Access:
- Login required.

Request:
```json
{
  "content": "댓글 내용"
}
```

Response:
```ts
type CreateCommunityPostCommentResponse = {
  status: 201;
  message: string;
  comment: {
    comment_id: number;
    post_id: number;
    user_id: number;
    nickname: string;
    content: string;
    like_count: 0;
    created_at: string;
  };
};
```

Notes:
- Successful creation increments `POSTS.comment_count`.
- `user_id` and `nickname` are extracted from JWT.

Errors:
- `400`: empty comment content.
- `401`: invalid or expired token.
- `404`: post not found.
- `500`: server error.

### Community Post Comment Update

Endpoint:
```http
PUT {baseURI}/api/posts/{postId}/comments/{commentId}
```

Access:
- Login required.
- Only the comment author can update.

Request:
```json
{
  "content": "수정된 댓글 내용"
}
```

Response:
```ts
type UpdateCommunityPostCommentResponse = {
  status: 200;
  message: string;
  comment: {
    comment_id: number;
    content: string;
    updated_at: string;
  };
};
```

Errors:
- `400`: empty comment content.
- `401`: invalid or expired token.
- `403`: not the author.
- `404`: comment not found.
- `500`: server error.

### Community Post Comment Delete

Endpoint:
```http
DELETE {baseURI}/api/posts/{postId}/comments/{commentId}
```

Access:
- Login required.
- Only the comment author can delete.

Response:
```ts
type DeleteCommunityPostCommentResponse = {
  status: 200;
  message: string;
};
```

Notes:
- Successful deletion decrements `POSTS.comment_count`, clamped at `0`.
- Related `POST_COMMENT_LIKES` rows are deleted by cascade or explicit deletion.

Errors:
- `401`: invalid or expired token.
- `403`: not the author.
- `404`: comment not found.
- `500`: server error.

### Community Post Comment Likes

Register:
```http
POST {baseURI}/api/posts/{postId}/comments/{commentId}/likes
```

Cancel:
```http
DELETE {baseURI}/api/posts/{postId}/comments/{commentId}/likes
```

Access:
- Login required.

Response:
```ts
type CommunityPostCommentLikeResponse = {
  status: 200;
  message: string;
  data: {
    comment_id: number;
    like_count: number;
  };
};
```

Notes:
- `POST_COMMENT_LIKES(comment_id, user_id)` has a unique constraint to prevent duplicates.
- Register increments `COMMENTS.like_count`.
- Cancel deletes the matching row and decrements `COMMENTS.like_count`, clamped at `0`.

Errors:
- `400`: duplicate like, or no existing like history on cancel.
- `401`: invalid or expired token.
- `404`: comment not found.
- `500`: server error.

### Community API Gaps To Ask Backend

These are the remaining items to confirm before connecting the bottom tab `[커뮤니티]` page end to end:

- Post list needs `is_liked` if the card heart state should be accurate without fetching every detail page.
- Post list/detail need `is_mine` or a stable current-user id comparison rule for edit/delete menu visibility.
- Post list/detail/comment responses do not include author profile image; confirm whether the UI should show a placeholder or backend should add `profile_image_url`.
- Comment list does not include `is_mine`; frontend can compare `user_id`, but only if auth context has the same numeric id used by backend.
- There is no comment reply API in these PDFs. If current `[커뮤니티]` UI has nested replies, either hide replies or request reply list/create/update/delete/like specs.
- Create post supports multipart file upload, but update post only accepts `image_urls`. Confirm how to upload newly added images during edit.
- Confirm whether post update should also support image deletion/reorder via complete replacement only, as the PDF says.
- Confirm whether `board_type` should map exactly to UI tabs: 자유게시판 `FREE`, 시음 후기 `TASTING_REVIEW`, 레시피 토론 `RECIPE_DISCUSSION`.
- Confirm whether search is needed. The provided list API has no `keyword` query.
- Confirm whether "popular" sorting by `like_count DESC` is enough, or whether comment count / recent activity should influence ranking.

## Funding Agreement Save

Source:
- User-provided backend controller/routes note on 2026-05-10.

Endpoint:
```http
POST {baseURI}/api/fundings/agreements
```

Access:
- 로그인 필요.
- 양조장 계정만 가능해야 한다.
- `Authorization: Bearer {accessToken}` 필요.

Purpose:
- 양조장이 새 펀딩 프로젝트를 생성하기 전 필수 약관 동의 여부를 저장한다.
- 약관 동의 완료 후 펀딩 프로젝트 임시저장 단계로 이동한다.

Request:
```ts
type SaveFundingAgreementRequest = {
  breweryId: number;
  isAdultConfirmed: boolean;
  isContactInfoAgreed: boolean;
  isSettlementInfoAgreed: boolean;
  isFeePolicyAgreed: boolean;
  isResponsibilityAgreed: boolean;
};
```

Response:
```ts
type SaveFundingAgreementResponse = {
  agreementId: number;
  breweryId: number;
  message: string;
};
```

Success:
```json
{
  "agreementId": 1,
  "breweryId": 1,
  "message": "펀딩 약관 동의가 저장되었습니다."
}
```

Errors:
- `400`: 필수 약관 미동의. `필수 약관에 모두 동의해야 합니다.`
- `401`: 인증 실패. `인증이 필요합니다.`
- `403`: 권한 없음. `해당 양조장의 펀딩을 생성할 권한이 없습니다.`
- `404`: 양조장 정보 없음. `양조장 정보를 찾을 수 없습니다.`
- `500`: 서버 내부 오류.

Frontend connection:
- Connected on 2026-05-10.
- API client: `src/features/funding/api.ts`
- Screen: `src/features/brewery/project/screens/BreweryProjectTermsScreen.tsx`
- The existing UI still requires all 7 displayed terms to be checked before the next step. The API currently receives only the 5 fields defined by backend: adult, contact, settlement, fee, responsibility.
- The current mock brewery login has `user.id === "1"`, so `breweryId` is sent as `1`. If a mock/signup brewery has a non-numeric local id, the frontend temporarily falls back to `1` until real auth/brewery API provides a stable numeric brewery id.
- Server is usage-billed, so this endpoint was not manually called during frontend verification.

## Funding Draft Create

Source:
- User-provided backend controller/routes note on 2026-05-10.

Endpoint:
```http
POST {baseURI}/api/fundings/drafts
```

Access:
- 로그인 필요.
- 양조장 계정만 가능해야 한다.
- `Authorization: Bearer {accessToken}` 필요.

Purpose:
- 양조장이 새 펀딩 프로젝트를 작성하는 과정에서 입력한 내용을 임시저장한다.
- `breweryId`만 필수이며 나머지 필드는 없어도 저장 가능하다.
- 서버는 입력된 기본정보 필드 수를 기준으로 `progressRate`를 계산한다.

Request:
```ts
type CreateFundingDraftRequest = {
  breweryId: number;
  title?: string;
  shortTitle?: string;
  category?: string;
  mainIngredient?: string;
  subIngredient?: string;
  alcoholPercentage?: number;
  summary?: string;
};
```

Response:
```ts
type CreateFundingDraftResponse = {
  draftId: number;
  breweryId: number;
  status: "DRAFT";
  progressRate: number;
  message: string;
};
```

Success:
```json
{
  "draftId": 1,
  "breweryId": 1,
  "status": "DRAFT",
  "progressRate": 23,
  "message": "펀딩 프로젝트가 임시저장되었습니다."
}
```

Errors:
- `400`: 양조장 ID 누락. `양조장 ID는 필수입니다.`
- `401`: 인증 실패. `인증이 필요합니다.`
- `403`: 권한 없음. `해당 양조장의 펀딩을 생성할 권한이 없습니다.`
- `404`: 양조장 정보 없음. `양조장 정보를 찾을 수 없습니다.`
- `500`: 서버 내부 오류.

Frontend connection:
- Connected on 2026-05-10.
- API client: `src/features/funding/api.ts`
- Screen: `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`
- The existing local temporary save UX is preserved. On new project creation, pressing `임시저장` first calls `POST /api/fundings/drafts`; after success, the existing local draft payload is saved with `serverDraft` metadata.
- The frontend sends current basic information only: `title`, `shortTitle`, fixed `category: "MAKGEOLLI"`, `mainIngredient`, `subIngredient`, numeric `alcoholPercentage`, `summary`.
- Existing project edit mode does not call this create-draft endpoint yet. It keeps the current local temporary-save behavior until the draft update API is provided.
- Server is usage-billed, so this endpoint was not manually called during frontend verification.

## Funding Draft Update And Section Saves

Source:
- User-provided backend notes on 2026-05-10.

Connected on 2026-05-10:
- `PATCH /api/fundings/drafts/{draftId}`: 임시저장 프로젝트 수정
- `PATCH /api/fundings/drafts/{draftId}/basic-info`: 기본정보 저장
- `PATCH /api/fundings/drafts/{draftId}/schedule`: 목표 금액 및 일정 저장
- `PATCH /api/fundings/drafts/{draftId}/legal-info`: 법적 고시 정보 저장
- `PATCH /api/fundings/drafts/{draftId}/taste-profile`: 맛지표 저장
- `PATCH /api/fundings/drafts/{draftId}/plan`: 프로젝트 계획 정보 저장
- `PATCH /api/fundings/drafts/{draftId}/brewery-info`: 창작자/정산/사업자 정보 저장
- `PATCH /api/fundings/drafts/{draftId}/notices`: 환불/교환/성인인증/리스크 안내 저장

Frontend connection:
- API client: `src/features/funding/api.ts`
- Screen: `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`
- 기존 UI에는 섹션별 저장 버튼이 없으므로 UI 추가 없이 다음 방식으로 연결했다.
- `임시저장`을 다시 덮어쓸 때 저장된 `serverDraft.draftId`가 있으면 `PATCH /api/fundings/drafts/{draftId}`를 호출한다. 없으면 기존처럼 `POST /api/fundings/drafts`를 호출한다.
- 신규 프로젝트 최종 제출 시 `draftId`를 확보한 뒤 basic-info, schedule, legal-info, taste-profile, plan, brewery-info, notices를 순서대로 저장하고 성공하면 기존 프론트 로컬 게시글 생성 흐름을 실행한다.
- 수정 모드(`mode=edit`)는 펀딩 게시글 관리 플로우이므로 draft 생성/섹션 저장 API를 호출하지 않고 기존 로컬 수정 흐름을 유지한다.
- 서버는 usage-billed라 직접 호출 검증은 하지 않았다.

## Funding Document Upload

Connected on 2026-05-10:
- `POST /api/fundings/drafts/{draftId}/documents`: 필수 서류 업로드

Request:
- Header: `Authorization: Bearer {accessToken}`
- Body: `multipart/form-data`
- Fields: `documentType`, `file`

Document type mapping:
- `idCard`: `ETC`
- `businessLicense`: `BUSINESS_REGISTRATION`
- `salesPermit`: `MAIL_ORDER_BUSINESS`
- `alcoholPermit`: `LIQUOR_LICENSE`
- `manufacturingLicense`: `LIQUOR_LICENSE`

Frontend connection:
- API client: `src/features/funding/api.ts`
- Screen: `src/features/brewery/project/screens/BreweryProjectCreateScreen.tsx`
- 기존 화면 UI는 유지하고, 파일 선택 state를 파일명 문자열에서 기존 문자열 호환 `name/uri/mimeType/size` 구조로 확장했다.
- `expo-document-picker`에서 선택한 PDF/JPG/JPEG/PNG 파일만 허용하고 5MB 초과 파일은 프론트에서 먼저 막는다.
- 신규 프로젝트 최종 제출 시 `draftId`를 확보하고 섹션 저장을 완료한 뒤, 인증 서류 5개를 `FormData`로 순차 업로드한다.
- multipart 요청은 boundary 유지를 위해 `Content-Type`을 직접 지정하지 않고 `Authorization`만 붙인다.
- `alcoholPermit`와 `manufacturingLicense`는 현재 백엔드 enum상 둘 다 `LIQUOR_LICENSE`로 전송한다. 백엔드가 같은 `documentType`을 replace-only로 처리하면 두 서류를 구분할 수 없으므로, 실제 서버 정책이 replace-only라면 별도 enum 추가 또는 다중 파일 지원이 필요하다.
- 수정 모드의 기존 제출 서류 문자열은 로컬 수정 흐름 유지용이며 신규 업로드 API는 새 프로젝트 최종 제출 시 호출한다.
- 서버는 usage-billed라 직접 호출 검증은 하지 않았다.

Pending / Needs confirmation:
- `POST /api/fundings/drafts/{draftId}/submit`: 프로젝트 제출 API. request body 유무, 성공 response의 `fundingId`, 제출 후 status, 필수 섹션/서류 누락 실패 응답 명세가 필요하다.
- `GET /api/fundings/drafts/{draftId}/preview`: 프로젝트 미리보기 API. response 구조와 서버 저장 draft 기준인지, 저장 전 로컬 입력값까지 포함 가능한지 명세가 필요하다.

## Funding Support Order / Payment

Connected on 2026-05-10:
- `POST /api/fundings/{fundingId}/orders`: 후원 주문 생성
- `POST /api/orders/{orderId}/payment`: 결제 요청
- `GET /api/orders/{orderId}/payment`: 결제 정보 조회
- `GET /api/fundings/{fundingId}/support-options`: 후원 옵션 조회
- `GET /api/orders/{orderId}`: 주문 상세 조회

Frontend connection:
- API client: `src/features/funding/api.ts`
- Mapper: `src/features/funding/apiMappers.ts`
- Screens: `src/features/funding/screens/FundingDetailScreen.tsx`, `src/features/funding/screens/FundingSupportScreen.tsx`
- 상세 후원 옵션 모달 또는 후원하기 화면 진입 시 후원 옵션 API를 호출한다. 기존 UI를 유지하기 위해 서버 옵션명이 현재 프로젝트와 매칭되는 경우에만 1병 가격/대표 리워드명/용량을 기존 `FundingProject`에 merge한다.
- 후원 최종 확인 시 주문 생성 API를 먼저 호출하고, 응답의 `orderId`와 `totalAmount`로 결제 요청 API를 호출한다.
- 결제 요청 응답의 `paymentUrl`이 있으면 React Native `Linking.openURL(paymentUrl)`로 실제 URL을 연 뒤 기존 후원 성공 모달 흐름을 유지한다.
- 결제 요청 후 `GET /api/orders/{orderId}/payment`와 `GET /api/orders/{orderId}`를 호출한다. 단, 현재 배포 서버에서 `GET /api/orders/{orderId}/payment`는 HTML 404를 반환하므로 프론트는 이 missing endpoint 에러를 숨기고 기존 성공 흐름을 유지한다. 백엔드 mock 결제는 별도 결제 완료 callback/webhook 명세가 없으므로, paymentUrl open 이후 프론트 기존 성공 처리로 이어진다.
- 현재 결제 요청 mock은 서버 내부 주문 금액을 `36000`으로 고정 비교하는 명세다. UI에서 1병 또는 다른 수량을 선택하면 주문 생성 응답 금액과 결제 요청 mock 검증 금액이 맞지 않아 실패할 수 있다. 실제 결제 검증 전에는 백엔드가 주문 생성 금액과 결제 요청 검증 금액을 같은 기준으로 맞춰야 한다.

Funding seed data note:
- 2026-05-10 사용자 지시에 따라 프론트 런타임 펀딩 seed 목록은 `봄을 담은 벚꽃 막걸리 프로젝트`, `꽃향기 가득한 생막걸리 프로젝트`, `산사 막걸리 프로젝트` 3개만 유지한다.
- 사용자는 `신사 막걸리 프로젝트`라고 적었지만 현재 코드의 기존 seed title은 `산사 막걸리 프로젝트`이므로 기존 데이터를 유지했다. 실제 표기 변경이 필요하면 seed title/brewery 문구를 별도 확인 후 수정한다.

## Funding Lookup APIs

Connected on 2026-05-10:
- `GET /api/fundings`: 펀딩 프로젝트 목록 조회
- `GET /api/fundings/{fundingId}`: 상세 조회
- `GET /api/fundings/{fundingId}/intro`: 프로젝트 소개 조회
- `GET /api/fundings/{fundingId}/brewery-logs`: 양조일지 조회
- `POST /api/fundings/{fundingId}/brewery-logs`: 양조일지 등록
- `PATCH /api/fundings/{fundingId}/brewery-logs/{breweryLogId}`: 양조일지 수정
- `DELETE /api/fundings/{fundingId}/brewery-logs/{breweryLogId}`: 양조일지 삭제
- `GET /api/fundings/{fundingId}/share-link`: 펀딩 공유 링크 조회
- `POST /api/fundings/{fundingId}/reports`: 펀딩 신고 등록
- `GET /api/fundings/reports`: 펀딩 신고 목록 조회 API client 추가

Frontend connection:
- API client: `src/features/funding/api.ts`
- Mapper: `src/features/funding/apiMappers.ts`
- Screens: `src/features/funding/screens/FundingListScreen.tsx`, `src/features/funding/screens/FundingDetailScreen.tsx`, `src/features/brewery/project/screens/BreweryJournalManageScreen.tsx`
- 목록 화면은 현재 필터/정렬 UI를 유지하고 `전체 -> status 생략`, `진행중인 프로젝트 -> ONGOING`, `성사된 프로젝트 -> ENDED`, `인기순/추천순 -> POPULAR`, `마감임박 -> DEADLINE`, `최신순 -> LATEST`로 조회한다.
- 서버 응답은 기존 `FundingProject`를 완전 대체하지 않고 merge한다. 현재 백엔드 mock 응답은 기존 화면 mock보다 필드가 적고 일부 응답이 벚꽃 프로젝트 기준으로 고정되어 있어, 제목/리워드/상태/가격 등 기존 UI 데이터가 잘못 덮이지 않게 프로젝트명이 매칭될 때만 상세·소개·후원 옵션 주요 값을 반영한다.
- 목록 API로 새 서버 fundingId가 내려오면 기존 카드 형식에 맞춘 최소 `FundingProject`로 추가된다.
- 양조일지는 `logs`를 기존 `JournalEntry` 구조로 매핑한다. 조회 응답은 기존 `step` 문자열과 신규 `stage` enum을 모두 수용한다. 서버에는 양조일지 댓글/대댓글 조회 명세가 없으므로 기존 로컬 댓글 UX는 유지한다.
- 양조일지 등록/수정은 기존 관리 화면의 이미지 선택값을 `multipart/form-data` `images`로 전송한다. 기존 이미지 삭제는 수정 시 제거된 URL을 `deleteImageUrls`로 전송한다.
- 현재 프론트 양조일지 단계는 1~5 숫자 단계이고 백엔드 stage enum은 `INGREDIENT`, `FERMENTATION`, `AGING`, `BOTTLING`, `SHIPPING`이다. 현재 매핑은 `1 -> INGREDIENT`, `2 -> INGREDIENT`, `3 -> FERMENTATION`, `4 -> AGING`, `5 -> BOTTLING`이다. 프론트에는 배송 단계가 따로 없으므로 `SHIPPING`은 현재 화면에서 전송하지 않는다.
- 공유하기는 상세 화면의 기존 공유 모달에서 `GET /api/fundings/{fundingId}/share-link`를 호출한 뒤 Native Share를 연다. 현재 배포 서버에서 share-link 라우트가 HTML 404를 반환하는 케이스가 확인되어, 프론트는 기본 앱 공유 URL로 fallback한다.
- 신고하기는 상세 화면의 기존 신고 모달에서 백엔드 enum(`FALSE_INFORMATION`, `INAPPROPRIATE_CONTENT`, `COPYRIGHT`, `FRAUD`, `ETC`)으로 전송한다.
- 신고 목록 조회는 관리자/운영자 화면이 현재 앱에 없어 API client만 추가했다.
- 서버 과금 방지를 위해 직접 호출 검증은 하지 않았다.

## Funding Q&A / Review APIs

Connected on 2026-05-10:
- `GET /api/fundings/{fundingId}/questions`: Q&A 목록 조회
- `POST /api/fundings/{fundingId}/questions`: 질문 등록
- `POST /api/fundings/{fundingId}/questions/{questionId}/replies`: 답글 등록
- `GET /api/fundings/{fundingId}/reviews`: 후기 목록 조회
- `POST /api/fundings/{fundingId}/reviews`: 후기 작성
- `POST /api/fundings/{fundingId}/inquiries`: 양조장 1:1 문의 등록 API client 추가. 사용자가 1:1 문의는 Q&A로 대체한다고 정리했으므로 현재 화면에서는 호출하지 않는다.

Frontend connection:
- API client: `src/features/funding/api.ts`
- Mapper: `src/features/funding/apiMappers.ts`
- Screen: `src/features/funding/screens/FundingDetailScreen.tsx`
- Q&A 탭 진입 시 질문 목록을 조회하고, 기존 Q&A 카드 구조에 맞춰 writer/content/date를 merge한다. 서버 질문 응답에는 답글 목록이 없으므로 기존 로컬 답글은 같은 questionId 기준으로 보존한다.
- 현재 Q&A UI에는 제목 입력칸이 없으므로 질문 등록 API의 `title`은 질문 내용 앞 30자를 사용하고, `content`는 전체 입력값을 보낸다. UI는 변경하지 않았다.
- 답글 등록은 기존 인라인 답글 입력 UI에서 `content`만 전송한다. 성공 응답의 `replyId`로 기존 로컬 답글 카드에 추가한다.
- 후기 탭 진입 시 후기 목록을 조회하고 기존 `FundingReview` 구조로 merge한다.
- 새 후기 작성은 `FundingReviewWriteScreen`에서 `multipart/form-data`로 `rating`, `content`, `images`를 전송한다. 현재 화면은 기존 UI 정책상 이미지 최대 3장이다.
- 후기 수정 API 명세는 아직 제공되지 않아 후기 수정 모드는 기존 로컬 수정 흐름을 유지한다.
- 양조장 1:1 문의 등록은 사용자가 Q&A로 대체한다고 확정해 현재 화면에서는 호출하지 않는다.

## Funding Likes / My Orders

Connected on 2026-05-10:
- `POST /api/fundings/{fundingId}/likes`: 펀딩 찜 등록
- `DELETE /api/fundings/{fundingId}/likes`: 펀딩 찜 해제
- `GET /api/users/me/funding-orders`: 마이페이지 후원 내역 조회

Frontend connection:
- API client: `src/features/funding/api.ts`
- Contexts: `src/contexts/FavoritesContext.tsx`, `src/contexts/FundingContext.tsx`
- Screen: `src/features/mypage/screens/MyPageScreen.tsx`
- 찜 버튼은 기존 로컬 optimistic UI를 유지하면서 등록/해제 API를 호출하고, 실패하면 로컬 상태를 되돌린다. 단, 서버가 이미 같은 상태라고 알려주는 `이미 찜한 프로젝트입니다.` / `찜하지 않은 프로젝트입니다.` 응답은 멱등 성공처럼 처리해 화면 상태를 서버 기준에 맞춘다.
- 런타임에서 `POST/DELETE /api/fundings/{fundingId}/likes`가 HTML 404를 반환하는 케이스가 확인됐다. 이 경우 백엔드 likes 라우트가 실제 서버에 등록/배포되지 않았거나 해당 local seed fundingId가 서버에 없을 수 있으므로, 프론트는 경고를 숨기고 기존 로컬 찜 상태를 유지한다. 백엔드가 JSON API 응답을 반환하도록 라우트 등록 여부를 확인해야 한다.
- 마이페이지 진입 시 후원 내역을 조회해 `FundingContext.participatedFundings`에 병합한다. 현재 마이페이지에는 후원 내역 목록 UI가 없으므로 참여 펀딩 수와 후기 작성 권한 판단에만 반영한다.
- `GET /api/users/me/funding-orders`는 사용자가 전달한 최신 명세 경로 기준으로 연결했다. 현재 배포 서버에서는 HTML 404를 반환하므로, 프론트는 이 missing endpoint 에러를 숨기고 기존 로컬 참여 펀딩 상태를 유지한다.

## Recipe Status

레시피 상태값은 API마다 약간 다르게 쓰인다.

- Public list: `ALL`, `PUBLISHED`, `FUNDING_READY`, `FUNDING_IN_PROGRESS`, `COMPLETED`
- Brewery consumer recipe check: `ALL`, `NORMAL`, `FUNDING_READY`
- Brewery-created recipe initial status: `NORMAL`
- General recipe creation initial status: `PUBLISHED`

프론트 메모:
- 현재 하단바 `[주담]` 목록에는 상태 필터 UI가 없다. 목록 연결 시 기본은 `status=ALL`.
- `is_fundable === true`이면 레시피 상세에서 펀딩 제안 버튼 활성화 기준으로 사용할 수 있다.
- `FUNDING_READY`는 관심 수가 임계값을 넘어 펀딩 전환 가능해진 상태로 보인다.

## Recipe List

Source PDF:
- `f47c346e-85ca-4408-b59e-d66cf4c0e431_레시피_목록_조회.pdf`

Endpoint:
```http
GET {baseURI}/api/recipes
```

Access:
- Public. 비로그인 사용자 접근 가능.
- 로그인 상태면 `Authorization` 헤더를 붙일 수 있다.

Query:
- `sort`: `newest` 기본값, `popular`
- `status`: `ALL` 기본값, `PUBLISHED`, `FUNDING_READY`, `FUNDING_IN_PROGRESS`, `COMPLETED`
- `page`
- `size`

Response:
```ts
type RecipeListResponse = {
  recipes: Array<{
    recipe_id: number;
    title: string;
    summary: string;
    main_ingredient: string;
    author_type: "USER" | "BREWERY";
    status: string;
    is_fundable: boolean;
    interest_count: number;
    image_url: string | null;
    created_at: string;
  }>;
  totalElements: number;
  totalPages: number;
  currentPage: number;
};
```

Frontend mapping:
- `recipe_id` -> `Recipe.id`
- `title` -> `Recipe.title`
- `summary` -> `Recipe.description`
- `main_ingredient` -> `Recipe.ingredients` 후보. 현재 UI는 배열을 기대하므로 콤마 split 또는 상세 API 보강 필요.
- `author_type` -> 작성자 표시 fallback: `USER`는 `사용자`, `BREWERY`는 `양조장`
- `interest_count` -> 현재 UI의 `likes`
- `image_url` -> 카드 썸네일
- `created_at` -> `timestamp` 표시로 포맷 필요

Current connection plan:
- `인기순` -> `sort=popular`
- `최신순` -> `sort=newest`
- `내 추천순` UI는 유지하되 아직 API 연결 대상 아님
- 검색창은 아직 API 연결하지 않는다. 필요하면 현재 받은 페이지 내 로컬 필터만 유지한다.
- `status=ALL`, `page=0`, `size=20`부터 시작.

Missing for current `[주담]` list UI:
- 2026-05-10 신규 명세에서 해결됨: 작성자 닉네임 `author_nickname`, 작성자 프로필 이미지 `author_profile_image`, 댓글 수 `comment_count`, 현재 사용자 관심 여부 `is_interested`.
- `내 추천순`용 추천 점수 또는 추천 정렬 API

## Recipe Detail

Source PDF:
- `622da50b-0f64-4476-b854-ac6e1bf93500_레시피_상세_조회.pdf`

Endpoint:
```http
GET {baseURI}/api/recipes/{recipeId}
```

Access:
- Public. 비로그인 사용자 접근 가능.
- 로그인 상태면 `Authorization` 헤더를 붙일 수 있다.

Path:
- `recipeId`: 조회할 레시피 ID

Response:
```ts
type RecipeDetailResponse = {
  recipe: {
    recipe_id: number;
    title: string;
    content: string;
    abv_range: string;
    main_ingredient: string;
    ai_sub_ingredient: string | null;
    target_flavor: string;
    concept: string;
    summary: string;
    author_type: "USER" | "BREWERY";
    status: string;
    is_fundable: boolean;
    interest_count: number;
    image_url: string | null;
    created_at: string;
    updated_at: string;
  };
};
```

Frontend mapping:
- `content` -> 상세 설명/제조 과정 본문
- `abv_range` -> 도수 범위
- `main_ingredient` -> 메인 재료
- `ai_sub_ingredient` -> 서브 재료
- `target_flavor` -> 맛 태그/맛 방향. 현재 UI는 배열 태그를 기대하므로 split 또는 백엔드 배열 응답 보강 필요.
- `interest_count` -> 좋아요/관심 수
- `is_fundable` -> 펀딩 제안 버튼 활성화 판단

Missing for current detail UI:
- 2026-05-10 신규 명세에서 해결됨: 작성자 닉네임 `author_nickname`, 작성자 프로필 이미지 `author_profile_image`, 댓글 수 `comment_count`, 현재 사용자 관심 여부 `is_interested`.
- `target_flavor`, `main_ingredient`, `ai_sub_ingredient`가 문자열이라 UI chip 배열 매핑 규칙 필요

Errors:
- `404`: 레시피 없음
- `500`: 서버 내부 오류

## Recipe Create

Source PDF:
- `e8bde745-f14d-4e1c-b659-a699ca0b6863_레시피_작성.pdf`

Endpoint:
```http
POST {baseURI}/api/recipes
```

Access:
- 로그인 필요. 일반 사용자 또는 양조장.
- `author_type`은 JWT role에서 서버가 자동 추출한다.

Request:
- `multipart/form-data`
- Text fields: `title`, `content`, `abv_range`, `main_ingredient`, `target_flavor`, `concept`, `summary`
- File field: `image` optional. If omitted, backend stores `image_url = null`.
- Do not manually set `Content-Type: application/json` for this request.
- When sending `FormData`, do not manually set `Content-Type`; the runtime must set the multipart boundary.

Response:
```ts
type CreateRecipeResponse = {
  status: 201;
  message: string;
  recipe: {
    recipe_id: number;
    title: string;
    author_type: "USER" | "BREWERY";
    status: "PUBLISHED";
    is_fundable: boolean;
    interest_count: number;
    image_url: string | null;
    created_at: string;
  };
};
```

Notes:
- 초기 상태: `PUBLISHED`
- 초기 `is_fundable`: `false`
- 초기 `interest_count`: `0`
- `image_url` 미입력 시 null 허용. PDF에는 향후 AI 썸네일 자동 생성 가능성이 언급됨.
- AI 법률 필터링은 서버 계층에서 처리한다.
- 2026-05-12 업데이트: AI 법률 필터링이 통과하지 않으면 레시피 등록은 차단된다. 법률 위반 키워드, AI 서버 오류, 응답 시간 초과, AI 서버 연결 실패 등은 모두 `400`과 `message`로 내려올 수 있다. 프론트는 서버 `message`를 사용자에게 그대로 안내한다.
- 주요 실패 메시지:
  - `'{위반 키워드}' 표현을 수정해주세요`
  - `등록할 수 없는 내용이 포함되어 있습니다. 레시피 내용을 다시 확인해 주세요.`
  - `AI 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`
  - `AI 서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.`
  - `AI 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.`

Current screen gap:
- 현재 `RecipeCreateScreen`은 메인 재료 배열, 선택 서브 재료 배열, 맛 태그 배열, 직접 입력 태그를 가진다. API는 문자열 필드를 받으므로 전송 전 join 규칙이 필요하다.
- 2026-05-10 신규 명세에서 별도 이미지 업로드 API 없이 `POST /api/recipes`의 multipart `image` 필드로 직접 전송하도록 변경됨.

## Brewery Recipe Create

Source PDF:
- `746fc50d-6f68-4f36-9062-16d7294d39ad_양조장_레시피_등록.pdf`

Endpoint:
```http
POST {baseURI}/api/recipes/brewery
```

Access:
- 양조장 계정만 가능. JWT role이 `BREWERY`여야 한다.

Request:
```ts
type BreweryCreateRecipeRequest = {
  title: string;
  content: string;
  abv_range: string;
  main_ingredient: string;
  target_flavor: string;
  concept: string;
  summary: string;
  image_url?: string | null;
};
```

Response:
```ts
type BreweryCreateRecipeResponse = {
  status: 201;
  message: string;
  recipe: {
    recipe_id: number;
    title: string;
    author_type: "BREWERY";
    status: "NORMAL";
    is_fundable: false;
    interest_count: 0;
    image_url: string | null;
    created_at: string;
  };
};
```

Errors:
- `400`: 필수 항목 누락
- `401`: 인증 실패
- `403`: 양조장 계정 아님
- `500`: 서버 내부 오류

## Brewery Consumer Recipe Check

Source PDF:
- `11346145-c8a7-4ba6-b85a-d661b94420c0_양조장_소비자_레시피_확인.pdf`

Endpoint:
```http
GET {baseURI}/api/recipes/brewery
```

Access:
- 양조장 계정만 가능.

Purpose:
- 양조장이 소비자 작성 레시피를 확인하는 목록.
- `author_type = USER`로 고정 필터링.
- 기본 정렬은 `interest_count DESC`.

Query:
- `status`: `ALL` 기본값, `NORMAL`, `FUNDING_READY`
- `page`
- `size`

Response:
```ts
type BreweryConsumerRecipeListResponse = {
  recipes: Array<{
    recipe_id: number;
    title: string;
    summary: string;
    main_ingredient: string;
    author_type: "USER";
    status: string;
    is_fundable: boolean;
    interest_count: number;
    image_url: string | null;
    created_at: string;
  }>;
  totalElements: number;
  totalPages: number;
  currentPage: number;
};
```

## Recipe Interest

Source PDFs:
- `3a9a5985-4e1c-4c06-b9ec-23401949fe5d_레시피_관심_등록.pdf`
- `543d092a-2ac8-418a-b0ac-cc52736e77aa_레시피_관심_해제.pdf`

Register:
```http
POST {baseURI}/api/recipes/{recipeId}/interests
```

Cancel:
```http
DELETE {baseURI}/api/recipes/{recipeId}/interests
```

Access:
- 로그인 필요.

Path:
- `recipeId`

Request body:
- 없음

Response:
```ts
type RecipeInterestResponse = {
  status: 200;
  message: string;
  data: {
    recipe_id: number;
    interest_count: number;
    is_fundable: boolean;
  };
};
```

Notes:
- 관심 등록 성공 시 `RECIPES.interest_count + 1`.
- 관심 해제 성공 시 `RECIPES.interest_count - 1`, 0 미만 방지.
- 관심 수가 임계값 이상이면 `is_fundable = true`, `status = FUNDING_READY`로 자동 전환.
- 관심 해제 후 이미 `is_fundable = true`가 된 상태는 자동 되돌리지 않는 정책으로 보인다.
- 8주차 기준 임계값은 100 예정.

Errors:
- `400`: 중복 관심 등록 또는 관심 등록 이력 없음
- `401`: 인증 실패
- `404`: 레시피 없음
- `500`: 서버 내부 오류

Frontend mapping:
- 현재 UI의 하트/좋아요는 서버 용어상 `interest`.
- 목록/상세에서 토글하려면 현재 사용자의 관심 여부 필드가 필요하다. 목록/상세 응답에 `is_interested`가 없으므로 추가 요청 필요.

## Recipe Comments

### Comment List

Source PDF:
- `ab1e43f3-d2b2-4134-9cdd-a9f1437690c6_레시피_댓글_목록_조회.pdf`

Endpoint:
```http
GET {baseURI}/api/recipes/{recipeId}/comments
```

Access:
- Public. 비로그인 사용자 접근 가능.
- 로그인 상태면 댓글별 `is_liked`가 사용자 기준으로 계산된다.

Query:
- `page`
- `size`

Response:
```ts
type RecipeCommentListResponse = {
  comments: Array<{
    comment_id: number;
    user_id: number;
    nickname: string;
    author_profile_image: string | null;
    author_type: "USER" | "BREWERY";
    content: string;
    like_count: number;
    reply_count: number;
    is_liked: boolean;
    is_mine: boolean;
    created_at: string;
    updated_at: string | null;
  }>;
  totalElements: number;
  totalPages: number;
  currentPage: number;
};
```

Note:
- 정렬은 `created_at ASC`로 오래된 댓글 먼저.
- 2026-05-12 업데이트: 댓글 목록 응답은 루트 댓글만 반환하고, 작성자 닉네임/프로필/유형, 현재 사용자 좋아요 여부, 현재 사용자 작성 여부, `reply_count`를 포함한다.

Missing for current comment UI:
- 2026-05-10 신규 명세에서 해결됨: 루트 댓글 응답에 `author_type`, `author_profile_image`, `is_mine` 추가.
- 2026-05-10 신규 명세에서 대댓글 목록/작성 API 추가됨: `GET/POST /api/recipes/{recipeId}/comments/{commentId}/replies`.
- 2026-05-12 신규 명세에서 `reply_count`가 추가되어 답글 수 선표시도 해결됨.
- 대댓글 좋아요는 별도 API가 없지만 대댓글도 `recipe_comments` 행이므로 기존 댓글 좋아요 API(`POST/DELETE /api/recipes/{recipeId}/comments/{commentId}/likes`)에 대댓글 `comment_id`를 넣어 사용한다.

### Comment Create

Source PDF:
- `e6d9c6cc-5327-4d5e-8df1-5c7f6dd793d2_레시피_댓글_작성.pdf`

Endpoint:
```http
POST {baseURI}/api/recipes/{recipeId}/comments
```

Access:
- 로그인 필요.

Request:
```json
{
  "content": "댓글 내용"
}
```

Response:
```ts
type CreateRecipeCommentResponse = {
  status: 201;
  message: string;
  comment: {
    comment_id: number;
    recipe_id: number;
    user_id: number;
    nickname: string;
    content: string;
    like_count: 0;
    created_at: string;
  };
};
```

Errors:
- `400`: 댓글 내용 없음
- `401`: 인증 실패
- `404`: 레시피 없음
- `500`: 서버 내부 오류

### Comment Update

Source PDF:
- `94d8f7ed-55ab-4fd2-9c35-41375452b313_레시피_댓글_수정.pdf`

Endpoint:
```http
PUT {baseURI}/api/recipes/{recipeId}/comments/{commentId}
```

Access:
- 로그인 필요. 본인이 작성한 댓글만 수정 가능.

Request:
```json
{
  "content": "수정할 댓글 내용"
}
```

Response:
```ts
type UpdateRecipeCommentResponse = {
  status: 200;
  message: string;
  comment: {
    comment_id: number;
    content: string;
    updated_at: string;
  };
};
```

Errors:
- `400`: 댓글 내용 없음
- `401`: 인증 실패
- `403`: 본인 댓글 아님
- `404`: 댓글 없음
- `500`: 서버 내부 오류

### Comment Delete

Source PDF:
- `d10ae528-b4a1-435f-b227-36ae8e6aa8a8_레시피_댓글_삭제.pdf`

Endpoint:
```http
DELETE {baseURI}/api/recipes/{recipeId}/comments/{commentId}
```

Access:
- 로그인 필요. 본인이 작성한 댓글만 삭제 가능.

Response:
```ts
type DeleteRecipeCommentResponse = {
  status: 200;
  message: string;
};
```

Errors:
- `401`: 인증 실패
- `403`: 본인 댓글 아님
- `404`: 댓글 없음
- `500`: 서버 내부 오류

## Recipe Comment Likes

Source PDFs:
- `4299b042-b6d1-4739-b25b-789c914f1f48_레시피_댓글_좋아요_등록.pdf`
- `716e2b29-fae5-48e0-81ec-908a9ce2eb4d_레시피_댓글_좋아요_취소.pdf`

Register:
```http
POST {baseURI}/api/recipes/{recipeId}/comments/{commentId}/likes
```

Cancel:
```http
DELETE {baseURI}/api/recipes/{recipeId}/comments/{commentId}/likes
```

Access:
- 로그인 필요.

Request body:
- 없음

Response:
```ts
type RecipeCommentLikeResponse = {
  status: 200;
  message: string;
  data: {
    comment_id: number;
    like_count: number;
  };
};
```

Errors:
- `400`: 중복 좋아요 또는 좋아요 이력 없음
- `401`: 인증 실패
- `404`: 댓글 없음
- `500`: 서버 내부 오류

Frontend mapping:
- 댓글 목록의 `is_liked` 기준으로 POST/DELETE 중 하나를 호출한다.
- 대댓글도 `recipe_comments.comment_id`를 가지므로, 프론트는 대댓글 좋아요에도 같은 endpoint를 사용한다.

## Recipe Comment Replies

Source PDFs:
- `09e2c342-9036-45ac-890e-fe3ad3e689e4_레시피_댓글_대댓글_목록_조회.pdf`
- `9bc0b595-dc7f-43c2-a9be-a81b3f2a718b_레시피_댓글_대댓글_작성.pdf`

List:
```http
GET {baseURI}/api/recipes/{recipeId}/comments/{commentId}/replies?page=0&size=20
```

Create:
```http
POST {baseURI}/api/recipes/{recipeId}/comments/{commentId}/replies
```

Access:
- 목록 조회는 public. 로그인 시 `is_liked`, `is_mine`이 사용자 기준으로 계산된다.
- 작성은 로그인 필요.

Create request:
```json
{
  "content": "저도 그렇게 생각해요!"
}
```

List response:
```ts
type RecipeReplyListResponse = {
  replies: Array<{
    comment_id: number;
    user_id: number;
    nickname: string;
    author_profile_image: string | null;
    author_type: "USER" | "BREWERY";
    content: string;
    like_count: number;
    is_liked: boolean;
    is_mine: boolean;
    created_at: string;
    updated_at: string | null;
  }>;
  totalElements: number;
  totalPages: number;
  currentPage: number;
};
```

Create response:
```ts
type CreateRecipeReplyResponse = {
  status: 201;
  message: string;
  reply: {
    comment_id: number;
    recipe_id: number;
    parent_comment_id: number;
    user_id: number;
    nickname: string;
    content: string;
    like_count: number;
    created_at: string;
    parent_reply_count: number;
  };
  parent_reply_count: number;
};
```

Frontend connection:
- Connected on 2026-05-10.
- API client: `src/features/recipe/api.ts`
- Screen: `src/features/recipe/screens/RecipeDetailScreen.tsx`
- 서버 과금 방지를 위해 댓글 목록 조회 시 모든 댓글의 대댓글을 한 번에 N+1로 조회하지 않는다. 댓글 목록의 `reply_count`로 `N개 답글` 버튼을 먼저 표시하고, 사용자가 답글 입력을 열거나 답글 펼침을 누르는 시점에 해당 댓글의 대댓글 목록을 lazy load한다.
- 대댓글 작성 성공 후 기존 답글 UI에 응답 값을 추가하고, `parent_reply_count`로 부모 댓글의 `N개 답글` 숫자를 즉시 갱신한다.
- 대댓글 좋아요는 별도 endpoint가 없어 기존 댓글 좋아요 등록/취소 API에 대댓글 `comment_id`를 넣어 호출한다.

## Recipe Delete

Source PDF:
- `cbbc2ff2-e6e2-4af9-bd25-b5e78298d59d_레시피_삭제.pdf`

Endpoint:
```http
DELETE {baseURI}/api/recipes/{recipeId}
```

Access:
- 로그인 필요.
- 본인이 작성한 레시피만 삭제 가능.
- 삭제 가능 상태는 `PUBLISHED`, `FUNDING_READY`.
- `FUNDING_IN_PROGRESS`, `COMPLETED` 상태 레시피는 삭제 불가.

Request:
- Header: `Authorization: Bearer {access_token}`
- Path parameter: `recipeId`
- Body 없음.

Response:
```ts
type DeleteRecipeResponse = {
  status: 200;
  message: "레시피가 삭제되었습니다.";
};
```

Errors:
- `400`: 펀딩이 진행 중이거나 완료된 레시피는 삭제할 수 없음.
- `401`: 유효하지 않거나 만료된 토큰.
- `403`: 본인이 작성한 레시피가 아님.
- `404`: 레시피 없음.
- `500`: 서버 내부 오류.

Backend memo:
- `RECIPES.user_id`와 JWT user id를 비교한다.
- 삭제 시 `RECIPE_INTERESTS`, `RECIPE_COMMENTS`, `RECIPE_COMMENT_LIKES` 관련 데이터는 cascade 삭제한다.

Frontend connection:
- Connected on 2026-05-10.
- API client: `src/features/recipe/api.ts` `deleteRecipe`.
- Screen: `src/features/recipe/screens/RecipeDetailScreen.tsx`.
- `[주담]` 상세의 작성자 메뉴에 남겨둔 `삭제` 버튼에서 호출한다.
- 삭제 성공 후 목록으로 이동하고, 세션 공유 상태에서 해당 recipe id를 삭제 처리해 서버 목록을 즉시 다시 호출하지 않아도 목록 카드가 남아 보이지 않게 한다.
- 서버는 usage-billed라 직접 호출 검증은 하지 않았다.

## Recipe Funding Conversion

Source PDF:
- `e1a88a9f-4a71-4d8b-83e9-7bbf549e687a_레시피_펀딩_전환_제안.pdf`
- `915fe859-073a-433f-b181-cbb5a7d28f45_레시피_펀딩_전환_제안.pdf`

Endpoint:
```http
POST {baseURI}/api/recipes/{recipeId}/funding
```

Access:
- 로그인 필요.
- 양조장 계정만 가능.
- `FUNDING_READY` 상태인 레시피만 전환 가능.

Request:
```ts
type CreateRecipeFundingRequest = {
  title: string;
  description: string;
  goal_amount: number;
  start_date: string;
  end_date: string;
};
```

Response:
```ts
type CreateRecipeFundingResponse = {
  status: 201;
  message: string;
  funding: {
    funding_id: number;
    recipe_id: number;
    title: string;
    goal_amount: number;
    current_amount: number;
    start_date: string;
    end_date: string;
    funding_status: "ACTIVE" | string;
    recipe_status: "FUNDING_IN_PROGRESS" | string;
  };
};
```

Frontend connection:
- API client function added on 2026-05-10: `createRecipeFunding`.
- Connected to the `[주담]` brewery proposal flow on 2026-05-10 without skipping the user's required terms page.
- `RecipeDetailScreen` sends `recipeId` to `/brewery/project/terms?recipeId={recipeId}` when a brewery presses `이 레시피로 펀딩 제안하기`.
- `BreweryProjectTermsScreen` preserves `recipeId` and forwards it to `/brewery/project/create?recipeId={recipeId}` after agreement save succeeds.
- `BreweryProjectCreateScreen` calls this API during final submit only for new projects that have a valid `recipeId`. Payload mapping:
  - `title`: `basicInfo.title`
  - `description`: `projectPlan.introduction || basicInfo.summary`
  - `goal_amount`: `Number(fundingInfo.goalAmount)`
  - `start_date`: `fundingInfo.startDate`
  - `end_date`: computed funding end date from start date + duration
- Existing funding draft section save and document upload flow is preserved before recipe funding conversion. When conversion succeeds, the returned `funding_id` is merged into `FundingContext` as the visible app project id so the success modal can open `/funding/{funding_id}`.
- Server is usage-billed, so this endpoint was not manually called during frontend verification.

## Brewery Consumer Recipe Check

Source PDF:
- `c6b07d90-f975-4aa2-a9de-2fd28ae5f3b2_양조장_소비자_레시피_확인.pdf`

Endpoint:
```http
GET {baseURI}/api/recipes/brewery
```

Access:
- 로그인 필요.
- 양조장 계정만 가능.
- `Authorization: Bearer {accessToken}` 필요.

Purpose:
- 양조장이 소비자가 등록한 레시피만 확인한다.
- 서버는 `author_type = USER` 필터를 고정 적용한다.
- 기본 정렬은 `interest_count DESC`이며 별도 `sort` 파라미터가 없다.

Query:
- `status`: `ALL` 기본값 / `PUBLISHED` / `FUNDING_READY`
- `page`: 0부터 시작, 기본값 0
- `size`: 기본값 20

Response:
```ts
type BreweryConsumerRecipeListResponse = {
  recipes: Array<{
    recipe_id: number;
    title: string;
    summary: string;
    main_ingredient: string;
    author_type: "USER";
    status: string;
    is_fundable: boolean;
    interest_count: number;
    image_url: string | null;
    created_at: string;
  }>;
  totalElements: number;
  totalPages: number;
  currentPage: number;
};
```

Errors:
- `401`: 유효하지 않거나 만료된 토큰
- `403`: 양조장 계정만 사용 가능
- `500`: 서버 내부 오류

Frontend connection:
- API client added on 2026-05-10: `fetchBreweryConsumerRecipes`.
- It is not wired to replace the current `[주담]` list UI yet because this endpoint is fixed to consumer recipes + popularity sorting and the PDF response does not include `comment_count`, `is_interested`, `author_nickname`, or profile image fields used by the current shared recipe card state. Replacing the visible list with this endpoint would regress the current latest/popular list behavior and initial heart state.
- If the product wants a separate brewery-only "consumer recipe review" view/filter, this endpoint can be used safely there. For the current public `[주담]` list, `GET /api/recipes` remains the screen source.

## My Page Recipe APIs

### My Recipes

Source PDF:
- `764bb013-207c-41e1-8c40-a8f46c3b767e_마이페이지_내_레시피_목록.pdf`

Endpoint:
```http
GET {baseURI}/api/users/me/recipes
```

Access:
- 로그인 필요.

Query:
- `page`
- `size`

Response:
```ts
type MyRecipeListResponse = {
  recipes: Array<{
    recipe_id: number;
    title: string;
    summary: string;
    main_ingredient: string;
    status: string;
    is_fundable: boolean;
    interest_count: number;
    image_url: string | null;
    created_at: string;
  }>;
  totalElements: number;
  totalPages: number;
  currentPage: number;
};
```

Notes:
- 서버는 JWT user_id로 `RECIPES.user_id` 필터.
- 정렬: `created_at DESC`
- 응답에는 `author_type`이 포함되지 않는다.

### My Interested Recipes

Source PDF:
- `0b6d1c0a-0ef7-47e4-8a2d-0c2f7bdd1e1f_마이페이지_관심_레시피_목록.pdf`

Endpoint:
```http
GET {baseURI}/api/users/me/interests/recipes
```

Access:
- 로그인 필요.

Query:
- `page`
- `size`

Response:
```ts
type MyInterestedRecipeListResponse = {
  recipes: Array<{
    recipe_id: number;
    title: string;
    summary: string;
    main_ingredient: string;
    author_type: "CONSUMER" | "BREWERY";
    status: string;
    is_fundable: boolean;
    interest_count: number;
    image_url: string | null;
    interested_at: string;
  }>;
  totalElements: number;
  totalPages: number;
  currentPage: number;
};
```

Notes:
- 서버는 JWT user_id로 `RECIPE_INTERESTS` 조회 후 레시피 정보 JOIN.
- 정렬: `RECIPE_INTERESTS.created_at DESC`
- `interested_at`은 관심 등록 일시.
- 이 API에서는 `author_type` 값이 `CONSUMER / BREWERY`로 적혀 있는데, 다른 레시피 API는 `USER / BREWERY`를 사용한다. 백엔드와 값 통일 여부 확인 필요.

## API Gaps To Ask Backend

하단바 `[주담]` 화면 연결 전에 백엔드에 확인하거나 추가 요청할 내용:

- 목록/상세 응답에 현재 사용자의 관심 여부 필드 필요: `is_interested` 또는 `is_liked`.
- 목록 응답에 댓글 수 필요: `comment_count`.
- 목록/상세 응답에 작성자 이름/닉네임 필요: `author_nickname` 또는 `author_name`.
- 상세 응답에 작성자 프로필 이미지 필요: `author_profile_image_url`.
- 댓글 응답에 작성자 유형과 프로필 이미지 필요: `author_type`, `profile_image_url`.
- 댓글 수정/삭제 메뉴를 안정적으로 제어하려면 `is_mine` 또는 현재 사용자 id 매칭 정책 필요.
- 현재 프론트에는 대댓글 UI가 있으나 PDF 명세에는 대댓글 API가 없다. 대댓글을 유지할지 숨길지 결정 필요.
- 이미지 업로드 API가 필요하다. 레시피 작성 API는 `image_url`만 받는다.
- 2026-05-10 업데이트: 위 항목 중 목록/상세 작성자 정보, 댓글 수, 관심 여부, 댓글 작성자 정보, 댓글 `is_mine`, 대댓글 목록/작성, 레시피 작성 이미지 multipart는 신규 명세가 도착해 연결 완료했다.
- 레시피 작성 화면의 배열 입력값을 서버 문자열 필드로 보낼 join 규칙 필요.
- `author_type` 값이 API마다 `USER`, `CONSUMER`로 혼재한다. 프론트 enum 통일 전에 백엔드 확인 필요.
- `내 추천순` 정렬용 API 또는 추천 점수 필드가 필요하다.
- 검색 API는 현재 없음. 검색을 서버 연동하려면 `keyword` 같은 query parameter가 필요하다.
- 레시피 펀딩 전환 API는 2026-05-10에 `[주담]` 상세 → 펀딩 약관 → 펀딩 프로젝트 생성 최종 제출 흐름에 연결했다. 다만 `POST /api/recipes/{recipeId}/funding`는 서버에서 즉시 `ACTIVE` 프로젝트를 만들고, 기존 펀딩 생성 화면은 draft/심사 흐름도 함께 갖고 있으므로 실제 제품 정책상 즉시 ACTIVE가 맞는지, 또는 심사 제출 상태가 맞는지는 백엔드/기획 확인이 필요하다.

## Frontend Connection Log

2026-05-06:
- Server base URL registered as `http://43.202.24.223:3000`.
- Connected only APIs reachable through bottom tab `[주담]` flows.
- Connected:
  - `[주담]` list: `GET /api/recipes` with `sort=popular/newest`, `status=ALL`, `page=0`, `size=20`.
  - Recipe detail: `GET /api/recipes/{recipeId}`.
  - Recipe detail comments: `GET /api/recipes/{recipeId}/comments`.
  - Recipe interest toggle from list/detail: `POST/DELETE /api/recipes/{recipeId}/interests`.
  - Recipe comment create/update/delete: `POST/PUT/DELETE /api/recipes/{recipeId}/comments...`.
  - Recipe comment like toggle: `POST/DELETE /api/recipes/{recipeId}/comments/{commentId}/likes`.
  - Recipe create screen reached from `[주담]`: `POST /api/recipes`.
- Not connected:
  - My page recipe APIs: `GET /api/users/me/recipes`, `GET /api/users/me/interests/recipes`.
  - Brewery-only consumer recipe check: `GET /api/recipes/brewery`.
  - Brewery-only recipe create: `POST /api/recipes/brewery`.
- Auth-dependent APIs are guarded by access token lookup. Current mock login does not create an `access_token`, so these calls are not fired until a token is stored.
- Public APIs may attach a token if one exists; otherwise they are called without `Authorization`.

2026-05-07:
- Fixed frontend-only rendering issues found after the first `[주담]` API connection.
- `RecipeListScreen` no longer renders literal `\u....` escape text in JSX labels/placeholders/buttons; labels are normal Korean strings.
- `src/features/recipe/api.ts` fallback author labels are normal Korean strings: `사용자`, `양조장`.
- `RecipeDetailScreen` now shows a loading state while `GET /api/recipes/{recipeId}` is pending, instead of briefly showing mock/previous recipe content before the API response arrives.
- No backend code was changed and no new API endpoint was connected.

2026-05-07 temporary auth test note:
- A temporary Kakao JWT from the user's test account is saved into `SafeStorage` as `judam_access_token` when the current mock login/signup succeeds.
- This is only to test `[주담]` auth-required APIs before login/signup API integration.
- Remove `TEMP_JUDAM_ACCESS_TOKEN`, `saveTemporaryAccessToken`, and mock-auth token persistence from `src/contexts/AuthContext.tsx` when real login/signup APIs store the backend-issued token.
- Do not keep this temporary token structure for production.
- The first temporary Kakao token used `userId` in the JWT payload and caused `POST /api/recipes` to return backend `500`.
- On 2026-05-07, a backend test token with payload field `id: "2"` was verified by one direct `POST /api/recipes` call and returned `201` with `recipe_id: 14`.
- `TEMP_JUDAM_ACCESS_TOKEN` now uses that verified test token. On app start, if `judam_user` exists and the saved `judam_access_token` differs from the current temporary token, the frontend overwrites it so old bad tokens do not remain in storage.
- This direct server call was intentionally limited to one request because the server is usage-billed.

2026-05-07 error handling note:
- `POST /api/recipes` and some recipe detail comment APIs can still return backend `500 서버 내부 오류`.
- Frontend now catches recipe detail comment submit/delete failures so they do not surface as uncaught promise errors.
- Backend still needs to inspect server logs for the root cause of `500`, especially request body validation, null handling, JWT user mapping, and DB constraints.

2026-05-10 funding connection note:
- Connected funding 5th API group: `GET /api/fundings`, `GET /api/fundings/{fundingId}`, `GET /api/fundings/{fundingId}/intro`, `GET /api/fundings/{fundingId}/brewery-logs`.
- Connected funding 6th API group: `GET/POST /api/fundings/{fundingId}/questions`, `POST /api/fundings/{fundingId}/questions/{questionId}/replies`, `GET /api/fundings/{fundingId}/reviews`.
- Connected funding 7th remaining APIs: `GET /api/fundings/{fundingId}/support-options`, `GET /api/orders/{orderId}`. Order create and payment request were already connected.
- Added API client for `POST /api/fundings/{fundingId}/inquiries`, but the current React Native app has no visible 1:1 inquiry entry point, so no screen calls it yet.
- Funding lookup responses are merged into the existing UI model instead of replacing `FundingProject`; this preserves the richer current card/detail UI and locally created funding projects.
- Funding review create/update API was not provided, so review write/edit remains local state only.
- Document upload API remains pending until the project creation screen preserves real file URI and mimeType for multipart upload.
- Server was not manually called because it is usage-billed.

2026-05-10 recipe connection note:
- Read the new recipe PDFs from `C:\Users\USER\Downloads`.
- Updated recipe list/detail/comment schemas for `author_nickname`, `author_profile_image`, `comment_count`, `is_interested`, root comment `author_type`, root comment `author_profile_image`, and root comment `is_mine`.
- Connected recipe creation as `multipart/form-data` with optional `image` file field. Local gallery images are now sent as file uploads through `POST /api/recipes`; generated remote placeholder images are not uploaded.
- Connected recipe comment reply list and create APIs:
  - `GET /api/recipes/{recipeId}/comments/{commentId}/replies`
  - `POST /api/recipes/{recipeId}/comments/{commentId}/replies`
- Added recipe funding conversion API client:
  - `POST /api/recipes/{recipeId}/funding`
- 2026-05-10 additional connection: the detail button preserves the user's required terms page and then calls recipe funding conversion during final project submit.
- Connected recipe delete API:
  - `DELETE /api/recipes/{recipeId}`
  - The `[주담]` detail author menu delete action now calls the backend and hides the deleted card from the current list session after success.
- Server was not manually called because it is usage-billed.

## PDF Sources Read On 2026-05-06

- `f47c346e-85ca-4408-b59e-d66cf4c0e431_레시피_목록_조회.pdf`
- `622da50b-0f64-4476-b854-ac6e1bf93500_레시피_상세_조회.pdf`
- `e8bde745-f14d-4e1c-b659-a699ca0b6863_레시피_작성.pdf`
- `3a9a5985-4e1c-4c06-b9ec-23401949fe5d_레시피_관심_등록.pdf`
- `543d092a-2ac8-418a-b0ac-cc52736e77aa_레시피_관심_해제.pdf`
- `ab1e43f3-d2b2-4134-9cdd-a9f1437690c6_레시피_댓글_목록_조회.pdf`
- `e6d9c6cc-5327-4d5e-8df1-5c7f6dd793d2_레시피_댓글_작성.pdf`
- `94d8f7ed-55ab-4fd2-9c35-41375452b313_레시피_댓글_수정.pdf`
- `d10ae528-b4a1-435f-b227-36ae8e6aa8a8_레시피_댓글_삭제.pdf`
- `4299b042-b6d1-4739-b25b-789c914f1f48_레시피_댓글_좋아요_등록.pdf`
- `716e2b29-fae5-48e0-81ec-908a9ce2eb4d_레시피_댓글_좋아요_취소.pdf`
- `746fc50d-6f68-4f36-9062-16d7294d39ad_양조장_레시피_등록.pdf`
- `11346145-c8a7-4ba6-b85a-d661b94420c0_양조장_소비자_레시피_확인.pdf`
- `764bb013-207c-41e1-8c40-a8f46c3b767e_마이페이지_내_레시피_목록.pdf`
- `0b6d1c0a-0ef7-47e4-8a2d-0c2f7bdd1e1f_마이페이지_관심_레시피_목록.pdf`

## PDF Sources Read On 2026-05-10

- `52b65203-785a-4869-9d6b-f55fc0336922_레시피_작성.pdf`
- `a1df8db3-79e6-4887-b0e3-c6a18b4b98af_레시피_목록_조회.pdf`
- `66b5a551-37a2-49e0-b469-5cfa58c8bd17_레시피_상세_조회.pdf`
- `bedca053-82bf-4030-9e74-a3a94a10e80a_레시피_댓글_목록_조회.pdf`
- `09e2c342-9036-45ac-890e-fe3ad3e689e4_레시피_댓글_대댓글_목록_조회.pdf`
- `9bc0b595-dc7f-43c2-a9be-a81b3f2a718b_레시피_댓글_대댓글_작성.pdf`
- `e1a88a9f-4a71-4d8b-83e9-7bbf549e687a_레시피_펀딩_전환_제안.pdf`
- `915fe859-073a-433f-b181-cbb5a7d28f45_레시피_펀딩_전환_제안.pdf`
- `c6b07d90-f975-4aa2-a9de-2fd28ae5f3b2_양조장_소비자_레시피_확인.pdf`
- `cbbc2ff2-e6e2-4af9-bd25-b5e78298d59d_레시피_삭제.pdf`

## Recipe Suggestion Assist APIs

Source:
- User-provided backend note on 2026-05-13.

Base URL:
```http
http://43.202.24.223:3000
```

### Suggest Sub Ingredients

Endpoint:
```http
POST {baseURI}/api/recipe/suggest-sub-ingredients
```

Request:
```json
{
  "main_ingredient": "경기도 쌀",
  "region": "경기도"
}
```

Response:
```ts
type SuggestSubIngredientsResponse = {
  status: 200;
  message: "서브재료 추천 성공";
  data: {
    sub_ingredients: string[];
  };
};
```

Frontend connection:
- Connected on 2026-05-13.
- API client: `src/features/recipe/api.ts` `suggestRecipeSubIngredients`.
- Screen: `src/features/recipe/screens/RecipeCreateScreen.tsx` 서브 재료 `AI 생성` 버튼.
- The frontend sends the joined main ingredient text as `main_ingredient` and infers `region` from known Korean region words included in the main ingredient. If no region word is found, it sends an empty string.

### Suggest Flavor Tags

Endpoint:
```http
POST {baseURI}/api/recipe/suggest-flavor-tags
```

Request:
```json
{
  "title": "경기도 쌀 막걸리",
  "main_ingredient": "경기도 쌀",
  "sub_ingredients": ["누룩", "물"],
  "abv_range": "5~7도"
}
```

Response:
```ts
type SuggestFlavorTagsResponse = {
  status: 200;
  message: "맛 태그 추천 성공";
  data: {
    flavor_tags: string[];
  };
};
```

Frontend connection:
- Connected on 2026-05-13.
- API client: `src/features/recipe/api.ts` `suggestRecipeFlavorTags`.
- Screen: `src/features/recipe/screens/RecipeCreateScreen.tsx` 지향하는 맛 `AI 생성` 버튼.
- The frontend sends current title, joined main ingredient text, selected sub ingredients, and selected ABV range.

### Suggest Summary

Endpoint:
```http
POST {baseURI}/api/recipe/suggest-summary
```

Request:
```json
{
  "title": "경기도 쌀 막걸리",
  "main_ingredient": "경기도 쌀",
  "sub_ingredients": ["누룩", "물"],
  "abv_range": "5~7도",
  "flavor_tags": ["달콤함", "청량함"],
  "concept": null
}
```

Response:
```ts
type SuggestSummaryResponse = {
  status: 200;
  message: "요약문 추천 성공";
  data: {
    summary: string;
  };
};
```

Frontend connection:
- Connected on 2026-05-13.
- API client: `src/features/recipe/api.ts` `suggestRecipeSummary`.
- Screen: `src/features/recipe/screens/RecipeCreateScreen.tsx` 프로젝트 요약 `AI 생성` 버튼.
- The frontend sends selected flavor tags plus custom flavor tags. Empty concept is sent as `null`.
- These suggestion endpoints were not manually called during verification because the server is usage-billed. Verification used TypeScript and lint checks only.

2026-05-13 temporary disconnection:
- The frontend temporarily disconnected only the sub ingredient `AI 생성` button from `suggestRecipeSubIngredients`.
- The API client function and endpoint memo remain in place so it can be reconnected later by restoring the button handler in `src/features/recipe/screens/RecipeCreateScreen.tsx`.
- Flavor tag and summary suggestion buttons remain connected to their APIs.

2026-05-14 recipe create/suggestion update:
- Reconnected the `[주담]` recipe create screen sub ingredient `AI 생성` button to `POST /api/recipe/suggest-sub-ingredients`.
- `RecipeCreateScreen` sends joined main ingredients as `main_ingredient` and infers `region` from Korean region words in the main ingredient text. If no region is found, it sends an empty string.
- `POST /api/recipes` now includes selected sub ingredients as the optional multipart text field `sub_ingredient`, joined with `, `.
- `createRecipe` still sends all recipe create fields through `FormData` and does not manually set `Content-Type`, so the browser/runtime can set the multipart boundary.

2026-05-14 temporary sub ingredient demo fallback:
- The sub ingredient `AI 생성` button was temporarily disconnected again because `POST /api/recipe/suggest-sub-ingredients` is not ready enough for recipe creation demos.
- `RecipeCreateScreen` currently shows local demo suggestions: `누룩`, `물`, `유자`, `생강`, `꿀`.
- The API client function `suggestRecipeSubIngredients` remains in `src/features/recipe/api.ts` for later reconnection.
- Recipe creation still sends the user's selected demo sub ingredients to `POST /api/recipes` as multipart `sub_ingredient`.
- The AI implementation screenshot shows suggestion responses without the previous `data` wrapper, e.g. `{ "flavor_tags": [...] }` and `{ "summary": "..." }`. The frontend parser now accepts both wrapped (`data.flavor_tags`) and unwrapped (`flavor_tags`) response shapes.
- Direct test against `http://43.202.24.223:3000/api/recipe/suggest-flavor-tags` with `main_ingredient: "apple"`, `sub_ingredients: ["꿀"]`, `abv_range: "3%~5%"` returned `200` with an empty `flavor_tags` array. Per product request, only sub ingredients use local demo fallback; empty flavor tag responses are logged to the Metro console and no temporary flavor tags are shown.
- Backend-provided AI examples use `abv_range` in Korean degree format such as `5~7도`, while the recipe create screen displays recipe-create ranges such as `3%~5%`. For AI suggestion calls only, `RecipeCreateScreen` converts `3%~5%` -> `3~5도` and `15% 이상` -> `15도 이상`. Final recipe creation still sends the selected `%` range.

2026-05-14 recipe create validation update:
- `RecipeCreateScreen` now blocks submit before calling `POST /api/recipes` when required API fields are empty: title, main ingredient, `abv_range`, `target_flavor`, `concept`, and `summary/content`.
- This prevents demo submissions from reaching the backend with empty required multipart text fields, which can currently surface as backend `500 서버 내부 오류`.

2026-05-14 temporary token expiry note:
- The current mock user JWT in `AuthContext` expires at `2026-05-14 02:17:46 KST` (`2026-05-13T17:17:46Z`). After that point, `POST /api/recipes` can surface as backend `500 서버 내부 오류` instead of a clean `401`.
- Added a frontend JWT expiry guard for recipe creation so expired local tokens show a login-expired modal before calling the API.
- A new backend-issued test token or real login API token is needed to continue authenticated recipe creation demos after this expiry.
- Replaced the temporary brewery token in `AuthContext` with the user-provided token expiring at `2026-05-22 14:15:13 KST`. The provided token payload has `userId: "1"` but no `role` claim, so recipe creation may still fail if the backend requires `role` from JWT for `author_type`.
- Added a recipe create guard that decodes the saved JWT and blocks submit when the token has no `role`. This avoids sending refresh-token-shaped JWTs to `POST /api/recipes`, where the backend can currently surface the missing role as `500 서버 내부 오류`.
- Replaced the temporary brewery token again with a backend-provided access token containing `role: "BREWERY"`, expiring at `2026-05-21 12:58:19 KST`. This token is suitable for brewery-authenticated recipe create testing.
- Direct server verification with the new brewery token succeeded for both `POST /api/recipes` multipart without image and `POST /api/recipes/brewery` JSON without image, returning `201`. If the app still shows `500` or `Network request failed`, focus on app-side file upload/image asset state. `RecipeCreateScreen` now clears both preview and `imageAsset` when the image remove button is pressed and logs create payload metadata before submit.
- Follow-up direct verification with the same brewery token and a tiny 1x1 PNG attached as multipart `image` returned `500 서버 내부 오류`. Because the same endpoint succeeds without `image`, the remaining issue is backend-side multipart file handling/S3 upload/AI image pipeline, not the frontend text fields or token.
