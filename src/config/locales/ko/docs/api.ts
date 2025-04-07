export default {
  // API Docs Page
  'apiDocs': 'API 문서',
  'apiIntroduction': 'API 소개',
  'authentication': '인증',
  'tokenEndpoints': '토큰 엔드포인트',
  'marketEndpoints': '마켓 엔드포인트',
  'deployEndpoints': '배포 엔드포인트',
  
  // API Content Structure
  'apiVersion': 'API 버전',
  'currentVersion': '현재 버전',
  'baseUrl': '기본 URL',
  'requestFormat': '요청 형식',
  'responseFormat': '응답 형식',
  'errorCodes': '오류 코드',
  'rateLimit': '속도 제한',
  'authenticationMethod': '인증 방법',
  'authDescription': '모든 API 요청은 요청 헤더의 일부로 API 키를 포함해야 합니다. Pi.Sale 플랫폼의 개인 설정 페이지에서 API 키를 생성할 수 있습니다.',
  'apiKeyInstruction': 'Pi.Sale 플랫폼의 계정 설정에서 API 키를 얻을 수 있습니다.',
  'apiDescriptionText': 'Pi.Sale API를 통해 개발자는 Pi.Sale 플랫폼과 상호 작용하고, 토큰 데이터를 검색하고, 토큰 계약을 배포하고, 시장 정보에 액세스할 수 있습니다. 이 문서는 사용 가능한 모든 API에 대한 상세한 정보를 제공합니다.',
  'apiStatus': '상태',
  'apiStatusStable': '안정',
  'rateLimitDescription': 'API 요청은 분당 60개로 제한됩니다. 제한을 초과하면 429 응답 상태 코드를 받게 됩니다.',
  
  // Endpoint Description
  'endpointTitle': '엔드포인트',
  'endpointDescription': '설명',
  'endpointMethod': '메소드',
  'endpointExample': '예제',
  'requestParameters': '요청 매개변수',
  'responseFields': '응답 필드',
  'parameterName': '매개변수 이름',
  'parameterType': '유형',
  'parameterRequired': '필수',
  'parameterDescription': '설명',
  'fieldName': '필드 이름',
  'fieldType': '유형',
  'fieldDescription': '설명',
  'pageParamDesc': '페이지 번호(기본값: 1)',
  'limitParamDesc': '페이지당 항목 수(기본값: 20, 최대: 100)',
  'sortParamDesc': '정렬 필드(옵션: created_at, name, symbol, market_cap)',
  'orderParamDesc': '정렬 방향(옵션: asc, desc)',
  'tokenIdParamDesc': '토큰 ID(선택 사항)',
  'requestBodyTitle': '요청 본문',
  'exampleTokenName': '예제 토큰',
  'exampleTokenDesc': '이것은 예제 토큰입니다',
  
  // Example Request and Response
  'requestExample': '요청 예제',
  'responseExample': '응답 예제',
  'codeSnippet': '코드 스니펫',

  // Token Related Endpoints
  'listTokensEndpoint': '토큰 목록 가져오기',
  'listTokensDesc': '사용 가능한 모든 토큰 목록 가져오기',
  'getTokenDetailsEndpoint': '토큰 세부 정보 가져오기',
  'getTokenDetailsDesc': '특정 토큰에 대한 자세한 정보 가져오기',
  'getTokenHoldersEndpoint': '토큰 보유자 가져오기',
  'getTokenHoldersDesc': '특정 토큰의 보유자 목록 가져오기',
  
  // Market Related Endpoints
  'getMarketOverviewEndpoint': '마켓 개요 가져오기',
  'getMarketOverviewDesc': '전체 마켓 데이터 및 통계 가져오기',
  'getTokenPriceEndpoint': '토큰 가격 가져오기',
  'getTokenPriceDesc': '특정 토큰의 실시간 가격 정보 가져오기',
  'getMarketHistoryEndpoint': '마켓 히스토리 가져오기',
  'getMarketHistoryDesc': '마켓 역사 데이터 및 추세 가져오기',
  'getMarketTradesEndpoint': '최근 거래 가져오기',
  
  // Deploy Related Endpoints
  'createTokenEndpoint': '토큰 생성',
  'createTokenDesc': '새로운 토큰 프로젝트 생성',
  'deployTokenEndpoint': '토큰 배포',
  'deployTokenDesc': '생성된 토큰을 블록체인에 배포',
  'getDeployStatusEndpoint': '배포 상태 가져오기',
  'getDeployStatusDesc': '토큰 배포 프로세스의 현재 상태 가져오기',
  
  // SDK and Integration
  'sdkIntegration': 'SDK 및 통합',
  'sdkDescription': 'Pi.Sale은 개발자가 API를 통합하는 데 도움이 되는 다양한 프로그래밍 언어로 SDK를 제공합니다:',
  'javascriptSdk': 'JavaScript SDK',
  'pythonSdk': 'Python SDK',
  'javaSdk': 'Java SDK',
}; 