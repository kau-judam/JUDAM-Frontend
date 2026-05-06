# JUDAM Backend API Memo

이 파일은 백엔드가 전달한 API PDF 명세를 프론트 개발자가 바로 찾아볼 수 있도록 정리한 보조 문서다.

작업 규칙:
- API 관련 코드를 수정하기 전에는 반드시 `judam.md`와 이 `api.md`를 함께 확인한다.
- 서버 주소(`baseURI`)가 아직 확정되지 않은 API는 실제 호출 코드를 만들지 않고 연결 대기 상태로 둔다.
- 로그인/회원가입 API 연결 후 `access_token` 저장 위치가 정해지면 인증 API에 `Authorization: Bearer {access_token}` 헤더를 붙인다.
- 명세가 현재 화면 UI와 맞지 않거나 필드가 부족하면 바로 코드를 수정하지 않고 사용자에게 먼저 질문한다.
- 이 문서는 백엔드 내부 구현을 수정하기 위한 문서가 아니라 React Native/Expo 프론트 연결용 메모다.

## Common

Base URL:
- Current server: `http://43.202.24.223:3000`
- The server is usage-billed. Avoid unnecessary manual API calls during verification.
- Frontend constant: `src/features/recipe/api.ts`의 `JUDAM_API_BASE_URL`.

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
- 작성자 닉네임/이름
- 댓글 수
- 현재 사용자의 관심 등록 여부(`is_interested` 또는 `liked`)
- 작성자 프로필 이미지
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
- 작성자 닉네임/이름
- 작성자 프로필 이미지
- 현재 사용자의 관심 등록 여부
- 댓글 수
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
```ts
type CreateRecipeRequest = {
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

Current screen gap:
- 현재 `RecipeCreateScreen`은 메인 재료 배열, 선택 서브 재료 배열, 맛 태그 배열, 직접 입력 태그를 가진다. API는 문자열 필드를 받으므로 전송 전 join 규칙이 필요하다.
- 이미지 업로드 API가 별도로 필요하다. 현재는 로컬 이미지 URI만 있다.

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
    user_nickname: string;
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

Note:
- PDF 예시 중 첫 댓글에 `user_user_nickname` 오타처럼 보이는 필드가 있다. 스키마 표 기준 `user_nickname`을 사용한다.
- 정렬은 `created_at ASC`로 오래된 댓글 먼저.
- 현재 프론트 상세 댓글 UI는 `authorType`, `avatar`, 대댓글을 사용하지만 API에는 없음.

Missing for current comment UI:
- 작성자 유형(USER/BREWERY)
- 작성자 프로필 이미지
- 내가 작성한 댓글인지 여부(`is_mine`) 또는 프론트가 `user_id`로 판단할 수 있는 현재 사용자 id
- 대댓글 목록/작성/좋아요 API. 현재 화면에는 대댓글 UI가 있으나 전달된 명세에는 없음.

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
- 레시피 작성 화면의 배열 입력값을 서버 문자열 필드로 보낼 join 규칙 필요.
- `author_type` 값이 API마다 `USER`, `CONSUMER`로 혼재한다. 프론트 enum 통일 전에 백엔드 확인 필요.
- `내 추천순` 정렬용 API 또는 추천 점수 필드가 필요하다.
- 검색 API는 현재 없음. 검색을 서버 연동하려면 `keyword` 같은 query parameter가 필요하다.

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
