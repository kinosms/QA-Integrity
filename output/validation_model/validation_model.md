# 일반채팅 — 계층형 검증 모델 (Hierarchical Validation Model)

- 기능 16 · 검증 그룹 113 · 검증 항목 351 · 체크포인트 1142

# 메시지 송수신

> 검증 그룹 14 · 항목 42 · 체크포인트 145

## 장문 메시지 송수신

### 장문 전송 표시

- **Check Point**: 멘션·공백 포함 500자 이하 메시지는 전체보기 없이 말풍선에 전체 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 500자 이하 텍스트 입력 → 전송
  - Preconditions: 그룹채팅방, 멘션 포함 500자 이하 텍스트
  - Target: Bubble
  - Expected State: Bubble.MoreView=None
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 멘션·공백 포함 501자 이상 메시지는 말풍선에 전체보기 버튼이 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 501자 이상 텍스트 입력 → 전송
  - Preconditions: 그룹채팅방, 멘션 포함 501자 이상 텍스트
  - Target: Bubble
  - Expected State: MoreViewButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 표시 글자수 500 미만에 포함된 멘션은 말풍선에 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 멘션 포함 장문 전송
  - Preconditions: 그룹채팅방, 500자 이내 위치 멘션
  - Target: Mention
  - Expected State: Mention.Location=InBubble
  - Evidence: Screenshot
- **Check Point**: 500자를 초과한 위치의 멘션은 전체보기에서만 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 멘션 포함 장문 전송
  - Preconditions: 그룹채팅방, 500자 초과 위치 멘션
  - Target: Mention
  - Expected State: Mention.Location=InFullViewOnly
  - Evidence: Screenshot

### 수신 장문 전체보기·공유

- **Check Point**: 수신한 장문 메시지가 전체보기 뷰어에 모두 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 수신 장문 말풍선 전체보기 탭
  - Preconditions: 장문 메시지 수신 상태
  - Target: FullView
  - Expected State: FullView.Content=Full
  - Evidence: Screenshot, OCR
- **Check Point**: 전체보기 진입 전 말풍선 공유 버튼으로 전송 시 말풍선 내용 전체가 공유된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 공유 버튼 탭 → 친구 선택 → 전송
  - Preconditions: 장문 메시지 수신 상태, 친구A 존재
  - Target: ShareButton
  - Expected State: SharedContent=Full
  - Evidence: Screenshot, APIResponse
- **Check Point**: 전체보기 뷰어 내 공유 버튼으로 전송 시 장문 내용 전체가 공유된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 전체보기 진입 → 뷰어 공유 버튼 탭 → 친구 선택 → 전송
  - Preconditions: 장문 메시지 수신 상태
  - Target: ShareButton
  - Expected State: SharedContent=Full
  - Evidence: Screenshot, APIResponse

### 전체보기 뷰어 도구

- **Check Point**: 전체보기 뷰어 우측 상단에 톡 읽어주기·글자크기조정·공유하기 아이콘이 제공된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 수신 장문 전체보기 탭
  - Preconditions: 장문 메시지 수신 상태
  - Target: Toolbar
  - Expected State: Toolbar.Icons=[TalkReader,FontSize,Share]
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 톡 읽어주기 재생·일시정지가 정상 동작한다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 전체보기 진입 → 톡 읽어주기 실행
  - Preconditions: 장문 메시지 수신 상태, 톡 읽어주기 기능
  - Target: TalkReader
  - Expected State: Playback=Toggled
  - Evidence: Video, Log
- **Check Point**: 톡 읽어주기 배속 조정이 정상 동작한다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 전체보기 진입 → 톡 읽어주기 실행 → 배속 변경
  - Preconditions: 장문 메시지 수신 상태, 톡 읽어주기 기능
  - Target: TalkReader
  - Expected State: PlaybackSpeed=Adjustable
  - Evidence: Video, Log
- **Check Point**: 톡 읽어주기 앞으로·뒤로 건너뛰기가 정상 동작한다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 전체보기 진입 → 톡 읽어주기 실행 → 건너뛰기
  - Preconditions: 장문 메시지 수신 상태, 톡 읽어주기 기능
  - Target: TalkReader
  - Expected State: Skip=Enabled
  - Evidence: Video, Log
- **Check Point**: 톡 읽어주기 재생 중 본문 하이라이트가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 전체보기 진입 → 톡 읽어주기 실행
  - Preconditions: 장문 메시지 수신 상태, 톡 읽어주기 기능
  - Target: TalkReader
  - Expected State: Highlight=Shown
  - Evidence: Screenshot, Video
- **Check Point**: 글자 크기를 50%~200%까지 조정할 수 있다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 전체보기 진입 → 글자크기 조정
  - Preconditions: 장문 메시지 수신 상태
  - Target: FontSize
  - Expected State: FontSizeRange=50~200%
  - Evidence: Screenshot

## 임베드 이모지 전송

### OS 제공 이모지

- **Check Point**: OS 제공 이모지 1개를 단독 전송하면 큰 크기로 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → OS 이모지 1개 입력 → 전송
  - Preconditions: -
  - Target: Bubble
  - Expected State: EmojiSize=Large
  - Evidence: Screenshot
- **Check Point**: OS 제공 이모지를 텍스트와 함께 전송하면 작은 크기로 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → OS 이모지+텍스트 입력 → 전송
  - Preconditions: -
  - Target: Bubble
  - Expected State: EmojiSize=Small
  - Evidence: Screenshot

## 외부 앱 공유(셰어익스텐션)

### 셰어익스텐션 진입

- **Check Point**: 3rd party 앱에서 사진·동영상 선택 후 공유 시 액션시트(셰어익스텐션)가 노출된다.
  - Execution Path: 3rd party 앨범 앱 실행 → 미디어 선택 → 공유
  - Preconditions: OS=iOS
  - Target: ShareExtension
  - Expected State: ActionSheet=Shown
  - Evidence: Screenshot
- **Check Point**: 셰어익스텐션에서 동영상·사진을 최대 30개까지 선택할 수 있다.
  - Execution Path: 3rd party 앨범 앱 실행 → 미디어 선택 → 공유
  - Preconditions: OS=iOS
  - Target: ShareExtension
  - Expected State: MaxSelect=30
  - Evidence: Screenshot, ComponentTree

### 메시지 보내기 화면

- **Check Point**: 공유할 친구·채팅방 선택 후 [다음] 탭 시 메시지 보내기 화면이 표시된다.
  - Execution Path: 셰어익스텐션 진입 → 대상 선택 → [다음] 탭
  - Preconditions: OS=iOS
  - Target: SendScreen
  - Expected State: SendScreen=Shown
  - Evidence: Screenshot
- **Check Point**: 메시지 보내기 화면의 [전송] 버튼은 기본 활성화 상태로 노출된다.
  - Execution Path: 셰어익스텐션 진입 → 대상 선택 → [다음] 탭
  - Preconditions: OS=iOS
  - Target: SendButton
  - Expected State: SendButton=Enabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 메시지 보내기 화면에 공유할 사진 썸네일이 노출된다.
  - Execution Path: 셰어익스텐션 진입 → 대상 선택 → [다음] 탭
  - Preconditions: OS=iOS
  - Target: Thumbnail
  - Expected State: Thumbnail=Shown
  - Evidence: Screenshot
- **Check Point**: 메시지 입력 후 [전송] 탭 시 메시지와 선택 콘텐츠가 채팅방에 전송된다.
  - Execution Path: 셰어익스텐션 진입 → 대상 선택 → [다음] 탭 → 메시지 입력 → [전송] 탭
  - Preconditions: OS=iOS
  - Target: Bubble
  - Expected State: MessageSent
  - Evidence: Screenshot, APIResponse

## 클립보드 이미지 붙여넣기

### 이미지 클립보드 붙여넣기

- **Check Point**: 키보드 롱탭 후 클립보드 미리보기에 복사한 이미지가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 키보드 롱탭 → 클립보드 미리보기 메뉴 선택
  - Preconditions: OS=Android, 문자 포함 사진 복사됨
  - Target: Clipboard
  - Expected State: Clipboard.Image=Shown
  - Evidence: Screenshot
- **Check Point**: 붙여넣기 선택 시 이미지 편집 화면으로 이동된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 클립보드 미리보기 → 붙여넣기 선택
  - Preconditions: OS=Android, 이미지 클립보드 복사됨
  - Target: ImageEditor
  - Expected State: ImageEditor=Shown
  - Evidence: Screenshot
- **Check Point**: 이미지 편집 후 전송 시 이미지가 채팅방에 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 이미지 편집 → 전송
  - Preconditions: OS=Android
  - Target: Bubble
  - Expected State: ImageSent
  - Evidence: Screenshot, APIResponse

### gif 붙여넣기

- **Check Point**: gif 파일은 편집 화면을 거치지만 편집은 불가하다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 입력창 롱탭 붙여넣기 → 클립보드에서 gif 선택
  - Preconditions: OS=Android, gif 파일
  - Target: ImageEditor
  - Expected State: Editing=Disabled
  - Evidence: Screenshot
- **Check Point**: gif 전송 시 이미지가 채팅방에 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → gif 선택 → 전송
  - Preconditions: OS=Android, gif 파일
  - Target: Bubble
  - Expected State: ImageSent
  - Evidence: Screenshot, APIResponse

## 말풍선 복사

### 복사

- **Check Point**: 일반 텍스트 복사 후 붙여넣기 시 표시된 내용 그대로 붙여넣기된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 복사 선택 → 입력창 붙여넣기
  - Preconditions: -
  - Target: MessageInput
  - Expected State: PastedText=AsDisplayed
  - Evidence: Screenshot
- **Check Point**: 4000자 이상 텍스트 복사 시 말풍선에 표시된 내용까지만 붙여넣기된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 복사 선택 → 입력창 붙여넣기
  - Preconditions: 4000자 이상 텍스트
  - Target: MessageInput
  - Expected State: PastedText=BubbleDisplayedOnly
  - Evidence: Screenshot
- **Check Point**: 스크랩 말풍선 복사 시 URL 형태로 붙여넣기된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 복사 선택 → 입력창 붙여넣기
  - Preconditions: 스크랩 말풍선
  - Target: MessageInput
  - Expected State: PastedText=URL
  - Evidence: Screenshot
- **Check Point**: 멘션 포함 말풍선 복사 시 멘션 영역은 말풍선에 표시되는 이름으로 붙여넣기된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 복사 선택 → 입력창 붙여넣기
  - Preconditions: 멘션 포함 말풍선
  - Target: MessageInput
  - Expected State: PastedText=MentionName
  - Evidence: Screenshot
- **Check Point**: 붙여넣은 멘션은 멘션 표시 없이 @이름 텍스트 형태로 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 복사 선택 → 입력창 붙여넣기
  - Preconditions: 멘션 포함 말풍선
  - Target: MessageInput
  - Expected State: Mention.Style=PlainText
  - Evidence: Screenshot

### 선택복사

- **Check Point**: 선택복사 진입 시 텍스트가 전체 선택된 상태로 커스텀 메뉴가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 선택복사 선택
  - Preconditions: 텍스트 말풍선
  - Target: ContextMenu
  - Expected State: CustomMenu=Shown, TextSelection=All
  - Evidence: Screenshot
- **Check Point**: 디폴트 상태 커스텀 메뉴에 검색·복사·공유가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 선택복사 진입
  - Preconditions: 텍스트 말풍선
  - Target: ContextMenu
  - Expected State: Menu.Default=[검색,복사,공유]
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 일부 선택 시 커스텀 메뉴에 검색·복사·모두선택·공유가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 선택복사 진입 → 일부 선택
  - Preconditions: 텍스트 말풍선
  - Target: ContextMenu
  - Expected State: Menu.Partial=[검색,복사,모두선택,공유]
  - Evidence: Screenshot, ComponentTree
- **Check Point**: [복사하기] 탭 시 선택 영역 복사 후 선택복사 화면이 종료된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 선택복사 진입 → [복사하기] 탭
  - Preconditions: 텍스트 말풍선
  - Target: CopyButton
  - Expected State: SelectCopyView=Closed
  - Evidence: Screenshot
- **Check Point**: [복사하기] 탭 시 Android는 '클립보드에 복사되었어요.' 토스트가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 선택복사 진입 → [복사하기] 탭
  - Preconditions: 텍스트 말풍선, OS=Android
  - Target: Toast
  - Expected State: Toast="클립보드에 복사되었어요."
  - Evidence: Screenshot, OCR
- **Check Point**: [복사하기] 탭 시 iOS는 완료 팝업이 노출되지 않는다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 선택복사 진입 → [복사하기] 탭
  - Preconditions: 텍스트 말풍선, OS=iOS
  - Target: Toast
  - Expected State: CompletePopup=None
  - Evidence: Screenshot
- **Check Point**: [공유하기] 탭 시 외부 공유 sheet가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 선택복사 진입 → [공유하기] 탭
  - Preconditions: 텍스트 말풍선
  - Target: ShareSheet
  - Expected State: ShareSheet=Shown
  - Evidence: Screenshot
- **Check Point**: 외부 공유 시 선택복사한 텍스트가 전달된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 선택복사 진입 → [공유하기] 탭 → 외부 앱 공유
  - Preconditions: 텍스트 말풍선
  - Target: ShareSheet
  - Expected State: SharedText=SelectedText
  - Evidence: Screenshot, APIResponse

## 답장

### 답장 전송

- **Check Point**: text·이모티콘·사진·동영상 말풍선에 답장 시 원본 일부가 포함된 답장 말풍선이 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 답장 선택 → 메시지 입력 → 전송
  - Preconditions: -
  - Target: ReplyBubble
  - Expected State: ReplyBubble.Original=Included
  - Evidence: Screenshot, APIResponse
- **Check Point**: 멘션을 포함한 답장 전송 시 답장 메시지에 멘션이 포함되어 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 답장 선택 → 멘션 포함 입력 → 전송
  - Preconditions: 단체채팅방
  - Target: ReplyBubble
  - Expected State: ReplyBubble.Mention=Included
  - Evidence: Screenshot, APIResponse
- **Check Point**: 스와이프로 답장하기 설정 on/off에 따라 스와이프 답장이 동작한다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 스와이프
  - Preconditions: 설정>채팅>스와이프로 답장하기 on/off
  - Target: SwipeReply
  - Expected State: SwipeReply=ToggledBySetting
  - Evidence: Video

### 원본 메시지 이동

- **Check Point**: 답장 말풍선의 원본 메시지 영역 탭 시 원본 메시지 위치로 이동된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 답장 말풍선 원본 영역 탭
  - Preconditions: 답장 말풍선 존재
  - Target: Bubble
  - Expected State: Scroll=ToOriginal
  - Evidence: Screenshot
- **Check Point**: 원본 이동 시 채팅방 하단에 [답장으로 돌아가기] 버튼이 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 답장 말풍선 원본 영역 탭
  - Preconditions: 답장 말풍선 존재
  - Target: Button
  - Expected State: BackToReplyButton=Shown
  - Evidence: Screenshot
- **Check Point**: [답장으로 돌아가기] 버튼 탭 시 답장 말풍선으로 이동된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 답장 말풍선 원본 영역 탭 → [답장으로 돌아가기] 탭
  - Preconditions: 답장 말풍선 존재
  - Target: Bubble
  - Expected State: Scroll=ToReply
  - Evidence: Screenshot

### 답장 알림

- **Check Point**: 알림 off 그룹채팅이라도 답장 메시지 알림 on이면 내 말풍선 답장에 대한 알림이 푸시된다.
  - Execution Path: 상대 기기: 내 말풍선에 답장 전송
  - Preconditions: 알림 off 그룹채팅, 설정>알림>답장 메시지 알림 on
  - Target: PushNotification
  - Expected State: Push=Delivered
  - Evidence: Screenshot, Log
- **Check Point**: 답장 말풍선에 표시된 내 멘션이 강조되어 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 답장 말풍선 확인
  - Preconditions: 알림 off 그룹채팅, 내 멘션 포함 답장 수신
  - Target: Mention
  - Expected State: Mention.Highlight=Shown
  - Evidence: Screenshot

## 공유·전달

### 공유 피커 구성

- **Check Point**: 말풍선 컨텍스트 메뉴에서 공유(전달) 선택 시 공유 피커가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 공유(전달) 선택
  - Preconditions: Android=전달 메뉴 / iOS=공유 메뉴
  - Target: SharePicker
  - Expected State: SharePicker=Shown
  - Evidence: Screenshot
- **Check Point**: 공유 피커에 검색 영역이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 공유(전달) 선택
  - Preconditions: -
  - Target: SharePicker
  - Expected State: SearchArea=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 공유 피커에 폴더칩(전체/친구/최근공유/사용자폴더)이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 공유(전달) 선택
  - Preconditions: -
  - Target: SharePicker
  - Expected State: FolderChips=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 공유 피커에 채팅 리스트·즐겨찾기 친구·친구 리스트가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 공유(전달) 선택
  - Preconditions: -
  - Target: SharePicker
  - Expected State: Lists=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 대상자 선택 시 상단에 선택 항목 영역과 하단에 메시지 입력 영역·보내기 버튼이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 공유(전달) 선택 → 대상 선택
  - Preconditions: -
  - Target: SharePicker
  - Expected State: SelectedArea=Shown, MessageInput=Shown
  - Evidence: Screenshot, ComponentTree

### 검색

- **Check Point**: 공유 피커(퀵피커) 검색 아이콘 탭 시 검색어 입력 영역이 노출되고 키패드가 활성화된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 공유(전달) 선택 → 검색 아이콘 탭
  - Preconditions: -
  - Target: SearchInput
  - Expected State: SearchInput=Shown, Keyboard=Opened
  - Evidence: Screenshot

### 뷰 전환·보내기

- **Check Point**: 공유 피커 상단 핸들러 드래그 시 라지뷰↔풀뷰로 전환된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 공유(전달) 선택 → 핸들러 드래그
  - Preconditions: -
  - Target: SharePicker
  - Expected State: View=Toggled(Large/Full)
  - Evidence: Video
- **Check Point**: 대상 선택 후 [보내기] 탭 시 하단에 공유 완료 스낵바가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 공유(전달) 선택 → 대상 선택 → [보내기] 탭
  - Preconditions: -
  - Target: Snackbar
  - Expected State: Snackbar=Shown
  - Evidence: Screenshot
- **Check Point**: [보내기] 공유 완료 시 해당 채팅방으로 이동하지 않는다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 공유(전달) 선택 → 대상 선택 → [보내기] 탭
  - Preconditions: -
  - Target: SharePicker
  - Expected State: Navigation=None
  - Evidence: Screenshot
- **Check Point**: 퀵피커 목록 아이콘 탭 시 공유 대상 선택 풀피커 화면이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 공유(전달) 선택 → 목록 아이콘 탭
  - Preconditions: -
  - Target: FullPicker
  - Expected State: FullPicker=Shown
  - Evidence: Screenshot
- **Check Point**: 풀피커에서 대상 선택 후 [확인] 탭 시 전송되고 해당 채팅방으로 이동된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 공유(전달) 선택 → 목록 아이콘 탭 → 대상 선택 → [확인] 탭
  - Preconditions: -
  - Target: FullPicker
  - Expected State: MessageSent, Navigation=ToRoom
  - Evidence: Screenshot, APIResponse

### 메시지 입력 유무별 전달

- **Check Point**: 대상 선택 후 메시지 입력 없이 [보내기] 시 전달하려던 말풍선 내용이 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 공유(전달) 선택 → 대상 선택 → [보내기] 탭
  - Preconditions: -
  - Target: Bubble
  - Expected State: ForwardedContent=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 대상 선택 후 메시지 입력 후 [보내기] 시 입력한 메시지 내용도 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 공유(전달) 선택 → 대상 선택 → 메시지 입력 → [보내기] 탭
  - Preconditions: -
  - Target: Bubble
  - Expected State: InputMessage=Sent
  - Evidence: Screenshot, APIResponse

### 하단 메뉴

- **Check Point**: 공유 피커 하단 메뉴 실행 시 각 하단 메뉴가 정상 동작한다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → 공유(전달) 선택 → 하단 메뉴 실행
  - Preconditions: -
  - Target: Toolbar
  - Expected State: BottomMenu=Working
  - Evidence: Screenshot, Log

### 나에게

- **Check Point**: 컨텍스트 메뉴 [나에게] 선택 시 나와의 채팅방으로 전달된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [나에게] 선택
  - Preconditions: -
  - Target: ContextMenu
  - Expected State: ForwardedTo=MyChat
  - Evidence: Screenshot, APIResponse
- **Check Point**: Android에서 [나에게] 선택 시 '전달하였습니다.' 문구가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [나에게] 선택
  - Preconditions: OS=Android
  - Target: Toast
  - Expected State: Toast="전달하였습니다."
  - Evidence: Screenshot, OCR

## 공지 등록

### 공지 등록 얼럿

- **Check Point**: 컨텍스트 메뉴 [공지] 선택 시 공지 등록 얼럿이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [공지] 선택
  - Preconditions: -
  - Target: Alert
  - Expected State: Alert=Shown, Alert.Text="채팅방 상단 공지는 1건만 노출 가능합니다. 공지를 등록하시겠습니까?"
  - Evidence: Screenshot, OCR
- **Check Point**: 공지 등록 얼럿에서 [아니요] 선택 시 공지가 등록되지 않는다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [공지] 선택 → 얼럿 [아니요] 선택
  - Preconditions: -
  - Target: Alert
  - Expected State: Notice=NotRegistered
  - Evidence: Screenshot
- **Check Point**: 공지 등록 얼럿에서 [예] 선택 시 공지가 채팅방 상단에 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [공지] 선택 → 얼럿 [예] 선택
  - Preconditions: -
  - Target: NoticeBanner
  - Expected State: Notice=ShownTop
  - Evidence: Screenshot
- **Check Point**: 공지 등록 [예] 선택 시 공지 말풍선이 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [공지] 선택 → 얼럿 [예] 선택
  - Preconditions: -
  - Target: Bubble
  - Expected State: NoticeBubble=Sent
  - Evidence: Screenshot, APIResponse

## 책갈피

### 책갈피 설정

- **Check Point**: 말풍선A 컨텍스트 메뉴 [책갈피 설정] 선택 시 말풍선A가 책갈피로 설정된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [책갈피 설정] 선택
  - Preconditions: 책갈피 없는 상태
  - Target: Bookmark
  - Expected State: BookmarkA=Set
  - Evidence: Screenshot
- **Check Point**: 책갈피 설정 시 채팅방 우하단에 책갈피 아이콘이 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [책갈피 설정] 선택
  - Preconditions: 책갈피 없는 상태
  - Target: BookmarkIcon
  - Expected State: BookmarkIcon=Shown
  - Evidence: Screenshot
- **Check Point**: 책갈피 1개 상태에서 아이콘 탭 시 채팅방 검색화면에서 해당 말풍선으로 이동된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 책갈피 아이콘 탭
  - Preconditions: 책갈피 1개 설정
  - Target: BookmarkIcon
  - Expected State: Navigation=ToBookmarkedMessage
  - Evidence: Screenshot
- **Check Point**: 말풍선B를 추가 설정해도 책갈피 아이콘이 복수형 전환 없이 그대로 유지된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [책갈피 설정] 선택
  - Preconditions: 책갈피 1개 이상 설정
  - Target: BookmarkIcon
  - Expected State: BookmarkIcon=Unchanged
  - Evidence: Screenshot
- **Check Point**: 책갈피 2개 이상 상태에서 아이콘 탭 시 채팅방 검색화면에서 책갈피 목록이 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 책갈피 아이콘 탭
  - Preconditions: 책갈피 2개 이상 설정
  - Target: BookmarkList
  - Expected State: BookmarkList=Shown
  - Evidence: Screenshot
- **Check Point**: 책갈피는 최대 30개까지 설정할 수 있다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [책갈피 설정] 선택
  - Preconditions: -
  - Target: Bookmark
  - Expected State: BookmarkMax=30
  - Evidence: ComponentTree

### 책갈피 목록·편집

- **Check Point**: 책갈피 편집에서 목록에 표시할 내용을 편집할 수 있다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 책갈피 목록 진입 → [책갈피 편집] 진입
  - Preconditions: 책갈피 존재
  - Target: BookmarkList
  - Expected State: Edit=Enabled
  - Evidence: Screenshot
- **Check Point**: 책갈피 목록에서 책갈피 말풍선으로 이동할 수 있다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 책갈피 목록 진입 → 항목 탭
  - Preconditions: 책갈피 존재
  - Target: BookmarkList
  - Expected State: Navigation=ToBookmarkedMessage
  - Evidence: Screenshot
- **Check Point**: 책갈피 목록에서 책갈피를 삭제할 수 있다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 책갈피 목록 진입 → 삭제
  - Preconditions: 책갈피 존재
  - Target: BookmarkList
  - Expected State: Delete=Enabled
  - Evidence: Screenshot
- **Check Point**: 이모티콘·사진·동영상·파일 말풍선은 책갈피 목록에 썸네일이 추가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 책갈피 목록 진입
  - Preconditions: 이모티콘/사진/동영상/파일 말풍선 책갈피
  - Target: BookmarkList
  - Expected State: Thumbnail=Shown
  - Evidence: Screenshot

## 캡처

### 캡처 영역 선택 모드

- **Check Point**: 컨텍스트 메뉴 [캡처] 선택 시 캡처 영역 선택 모드로 전환된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [캡처] 선택
  - Preconditions: -
  - Target: CaptureMode
  - Expected State: CaptureMode=On
  - Evidence: Screenshot
- **Check Point**: 캡처 모드 상단에 '캡처 영역 선택' 타이틀과 [선택해제] 버튼이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [캡처] 선택
  - Preconditions: -
  - Target: Header
  - Expected State: Title="캡처 영역 선택", DeselectButton=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 컨텍스트 메뉴로 진입 시 "캡처 영역을 지정해주세요" 가이드 문구가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [캡처] 선택
  - Preconditions: -
  - Target: Header
  - Expected State: Guide="캡처 영역을 지정해주세요"
  - Evidence: Screenshot, OCR
- **Check Point**: [+]메뉴로 진입 시 "캡처를 시작할 말풍선을 선택해주세요" 가이드 문구가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → [+]메뉴 탭 → 캡처 선택
  - Preconditions: [+]메뉴 진입
  - Target: Header
  - Expected State: Guide="캡처를 시작할 말풍선을 선택해주세요"
  - Evidence: Screenshot, OCR
- **Check Point**: 캡처 모드에서 캡처 대상 외 말풍선은 딤드 처리된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [캡처] 선택
  - Preconditions: -
  - Target: Bubble
  - Expected State: NonSelected=Dimmed
  - Evidence: Screenshot
- **Check Point**: 캡처 모드 하단에 [캡처 옵션]·저장·전달 아이콘이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [캡처] 선택
  - Preconditions: -
  - Target: Toolbar
  - Expected State: BottomIcons=[CaptureOption,Save,Forward]
  - Evidence: Screenshot, ComponentTree

### 캡처 옵션

- **Check Point**: [캡처 옵션] 버튼 탭 시 프로필·배경 선택 옵션이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [캡처] 선택 → [캡처 옵션] 탭
  - Preconditions: -
  - Target: CaptureOption
  - Expected State: CaptureOption=Shown
  - Evidence: Screenshot
- **Check Point**: 프로필 옵션에 변경안함·모자이크·카카오프렌즈가 제공된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [캡처] 선택 → [캡처 옵션] 탭
  - Preconditions: -
  - Target: CaptureOption
  - Expected State: ProfileOption=[변경안함,모자이크,카카오프렌즈]
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 배경 옵션에 변경안함·기본배경이 제공된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [캡처] 선택 → [캡처 옵션] 탭
  - Preconditions: -
  - Target: CaptureOption
  - Expected State: BackgroundOption=[변경안함,기본배경]
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 옵션 변경 시 프로필·배경이 선택한 옵션으로 변경된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [캡처] 선택 → [캡처 옵션] 탭 → 옵션 변경
  - Preconditions: -
  - Target: Capture
  - Expected State: Capture=OptionApplied
  - Evidence: Screenshot

### 캡처 저장·공유

- **Check Point**: 영역 선택 후 저장 아이콘 탭 시 캡처 모드가 해제되고 채팅방으로 돌아간다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [캡처] 선택 → 영역 선택 → 저장 아이콘 탭
  - Preconditions: -
  - Target: CaptureMode
  - Expected State: CaptureMode=Off
  - Evidence: Screenshot
- **Check Point**: 저장 시 디바이스 앨범에 선택 영역 사진이 저장된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [캡처] 선택 → 영역 선택 → 저장 아이콘 탭
  - Preconditions: -
  - Target: Album
  - Expected State: Image=Saved
  - Evidence: Screenshot, DB
- **Check Point**: 영역 선택 후 공유·전달 아이콘으로 대상 선택·전송 시 캡처 모드가 해제되고 채팅방으로 돌아간다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [캡처] 선택 → 영역 선택 → 전달 아이콘 탭 → 대상 선택 → 전송
  - Preconditions: -
  - Target: CaptureMode
  - Expected State: CaptureMode=Off
  - Evidence: Screenshot
- **Check Point**: 캡처 공유 시 채팅방으로 캡처 이미지가 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [캡처] 선택 → 영역 선택 → 전달 아이콘 탭 → 대상 선택 → 전송
  - Preconditions: -
  - Target: Bubble
  - Expected State: CaptureImage=Sent
  - Evidence: Screenshot, APIResponse

## 메시지 삭제·수정·신고

### 모두에게서 삭제

- **Check Point**: [삭제] 메뉴는 전송 후 24시간 이내에만 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출
  - Preconditions: 내가 전송한 메시지
  - Target: ContextMenu
  - Expected State: DeleteMenu=Within24h
  - Evidence: Screenshot
- **Check Point**: [모두에게서 삭제] 선택 시 메시지가 삭제된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [삭제] 진입 → [모두에게서 삭제] 선택
  - Preconditions: 전송 후 24시간 이내
  - Target: Bubble
  - Expected State: Message=Deleted
  - Evidence: Screenshot
- **Check Point**: 모두에게서 삭제 시 상대방 말풍선이 '삭제된 메시지입니다' 피드로 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [모두에게서 삭제] 선택
  - Preconditions: 전송 후 24시간 이내
  - Target: Bubble
  - Expected State: Bubble="삭제된 메시지입니다"
  - Evidence: Screenshot, OCR
- **Check Point**: 모두에게서 삭제 시 상대방 채팅목록 라스트메시지가 '메시지가 삭제되었습니다.'로 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [모두에게서 삭제] 선택
  - Preconditions: 전송 후 24시간 이내
  - Target: ChatList
  - Expected State: LastMessage="메시지가 삭제되었습니다."
  - Evidence: Screenshot, OCR
- **Check Point**: 모두에게서 삭제 시 미확인 상태 상대방 푸시 알림이 사라진다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [모두에게서 삭제] 선택
  - Preconditions: 상대 앱 미실행/알림 미확인
  - Target: PushNotification
  - Expected State: Push=Removed
  - Evidence: Screenshot, Log
- **Check Point**: 모두에게서 삭제한 메시지는 롱탭하여 나에게서 삭제할 수 있다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 삭제된 메시지 롱탭
  - Preconditions: 모두에게서 삭제 완료
  - Target: ContextMenu
  - Expected State: DeleteForMe=Enabled
  - Evidence: Screenshot

### 나에게서만 삭제

- **Check Point**: [나에게서만 삭제] 후 메시지 선택·[삭제하기] 시 선택 메시지가 자신의 기기에서만 삭제된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [삭제] 진입 → [나에게서만 삭제] 선택 → 메시지 선택 → [삭제하기] 탭
  - Preconditions: -
  - Target: Bubble
  - Expected State: Message=DeletedLocalOnly
  - Evidence: Screenshot

### 신고

- **Check Point**: 친구 아닌 사용자 말풍선 롱탭 시 컨텍스트 메뉴 삭제 버튼 하위에 [신고] 버튼이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 수신 말풍선 롱탭
  - Preconditions: 친구 아닌 사용자 1:1 채팅방
  - Target: ContextMenu
  - Expected State: ReportButton=Shown
  - Evidence: Screenshot
- **Check Point**: [신고] 메뉴 선택 시 신고 사유 선택 화면으로 이동된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 수신 말풍선 롱탭 → [신고] 선택
  - Preconditions: 친구 아닌 사용자 1:1 채팅방
  - Target: ReportScreen
  - Expected State: ReportScreen=Shown
  - Evidence: Screenshot
- **Check Point**: 말풍선 롱탭을 통한 신고는 메시지 1개, 대상 1명으로 제한된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 수신 말풍선 롱탭 → [신고] 선택
  - Preconditions: 친구 아닌 사용자 1:1 채팅방
  - Target: ReportScreen
  - Expected State: ReportScope=1Message1Target
  - Evidence: Screenshot, ComponentTree

### 수정 진입

- **Check Point**: [수정] 메뉴는 전송 후 24시간 이내에만 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출
  - Preconditions: 내가 전송한 지원 타입 메시지(텍스트/이모티콘+텍스트/스티커+텍스트/답장 등)
  - Target: ContextMenu
  - Expected State: EditMenu=Within24h
  - Evidence: Screenshot
- **Check Point**: [수정] 선택 시 수정 모드로 전환되어 입력창이 열린다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [수정] 선택
  - Preconditions: 전송 후 24시간 이내
  - Target: MessageInput
  - Expected State: EditMode=On
  - Evidence: Screenshot
- **Check Point**: 메시지 수정 안내 팝업은 최초 1회만 발생한다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [수정] 선택
  - Preconditions: 최초 수정
  - Target: Alert
  - Expected State: Guide=OnceOnly
  - Evidence: Screenshot
- **Check Point**: 수정 시 상대방 채팅목록 라스트메시지가 마지막 수정 내용으로 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [수정] 선택 → 내용 수정 → 완료
  - Preconditions: -
  - Target: ChatList
  - Expected State: LastMessage=Updated
  - Evidence: Screenshot, OCR
- **Check Point**: 수정 시 미확인 상태 상대방 푸시 알림 내용이 갱신된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [수정] 선택 → 내용 수정 → 완료
  - Preconditions: 상대 앱 미실행/알림 미확인
  - Target: PushNotification
  - Expected State: Push.Content=Updated
  - Evidence: Screenshot, Log

### 수정 모드 UI·완료

- **Check Point**: 수정 모드는 입력창 레이어 형태로 제공되며 타이틀에 [✏️] 메시지 수정과 [X]가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [수정] 선택
  - Preconditions: -
  - Target: EditLayer
  - Expected State: EditLayer=Shown
  - Evidence: Screenshot
- **Check Point**: 수정 모드 입력창에 내가 보낸 원본 메시지 텍스트가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [수정] 선택
  - Preconditions: 이모티콘·스티커 제외, 미니이모티콘·임베드·OS이모지 포함
  - Target: EditLayer
  - Expected State: OriginalText=Shown
  - Evidence: Screenshot
- **Check Point**: 수정할 단어 입력 시 완료 [V] 버튼이 활성화되어 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [수정] 선택 → 단어 입력
  - Preconditions: -
  - Target: ConfirmButton
  - Expected State: ConfirmButton=Enabled
  - Evidence: Screenshot
- **Check Point**: 일부 텍스트 수정 후 완료 [V] 탭 시 수정한 문구로 말풍선이 업데이트된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [수정] 선택 → 일부 수정 → [V] 탭
  - Preconditions: -
  - Target: Bubble
  - Expected State: Bubble=Updated
  - Evidence: Screenshot
- **Check Point**: 수정 완료 시 말풍선 우측 하단에 '수정됨' 문구가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 노출 → [수정] 선택 → 일부 수정 → [V] 탭
  - Preconditions: -
  - Target: Bubble
  - Expected State: Label="수정됨"
  - Evidence: Screenshot, OCR

## 멘션 서제스트 UI

### 서제스트 활성화·입력

- **Check Point**: 입력창에 @문자 입력 시 멘션 서제스트 UI가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 입력창 선택 → @문자 입력
  - Preconditions: 단체채팅방, 입력 커서 앞 공백 1개 이상
  - Target: MentionSuggest
  - Expected State: MentionSuggest=Shown
  - Evidence: Screenshot
- **Check Point**: 서제스트 UI 최상단에 자기자신이 (나) 아이콘과 함께 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 입력창 선택 → @문자 입력
  - Preconditions: 단체채팅방
  - Target: MentionSuggest
  - Expected State: Self=TopWithBadge
  - Evidence: Screenshot
- **Check Point**: 서제스트 UI에 각 멤버의 프로필·닉네임이 이름순 정렬·스크롤 가능하게 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 입력창 선택 → @문자 입력
  - Preconditions: 단체채팅방
  - Target: MentionSuggest
  - Expected State: Members=SortedByName
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 이미 입력창에 멘션 추가된 친구는 우측에 @ 마킹이 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 멘션 추가 후 재 @입력
  - Preconditions: 단체채팅방, 기 멘션 추가된 친구
  - Target: MentionSuggest
  - Expected State: Mentioned=Marked
  - Evidence: Screenshot
- **Check Point**: 서제스트에서 친구 선택 시 입력창에 @+이름 멘션 문자열이 파란색으로 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → @문자 입력 → 서제스트에서 이름 선택
  - Preconditions: 단체채팅방
  - Target: MessageInput
  - Expected State: Mention.Color=Blue
  - Evidence: Screenshot
- **Check Point**: 멘션 추가 후 입력 포커스 뒤에 공백 1칸이 추가되어 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → @문자 입력 → 서제스트에서 이름 선택
  - Preconditions: 단체채팅방
  - Target: MessageInput
  - Expected State: Cursor=SpaceAppended
  - Evidence: Screenshot
- **Check Point**: 추가로 @입력 후 친구 선택 시 앞 멘션 뒤 한 칸 띄운 형태로 멘션이 추가된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 첫 멘션 추가 → 재 @입력 → 친구 추가 선택
  - Preconditions: 단체채팅방
  - Target: MessageInput
  - Expected State: Mention=Appended
  - Evidence: Screenshot

### 부분검색

- **Check Point**: 서제스트 활성 상태에서 닉네임 일부(영문·숫자·한글) 입력 시 like 검색으로 필터링된 서제스트가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → @문자 입력 → 닉네임 일부 입력
  - Preconditions: 단체채팅방, 숫자·영문·한글 닉네임 멤버 존재
  - Target: MentionSuggest
  - Expected State: Suggest=Filtered
  - Evidence: Screenshot
- **Check Point**: 참여 닉네임과 일치하지 않는 문자열 입력 시 서제스트 UI가 비활성화(사라짐)된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → @문자 입력 → 불일치 문자열 입력
  - Preconditions: 단체채팅방
  - Target: MentionSuggest
  - Expected State: MentionSuggest=Hidden
  - Evidence: Screenshot

### 멘션 개수 제한

- **Check Point**: 입력창 멘션 15개 상태에서 @입력 시 상단에 '한 번에 멘션 가능한 횟수를 초과했습니다.' 안내가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 입력창 선택 → @문자 입력
  - Preconditions: 입력창 멘션 15개
  - Target: MentionSuggest
  - Expected State: Notice="한 번에 멘션 가능한 횟수를 초과했습니다."
  - Evidence: Screenshot, OCR
- **Check Point**: 답장 입력창 멘션 15개 상태에서 @입력 시 동일한 초과 안내가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 답장 입력창 선택 → @문자 입력
  - Preconditions: 답장 상태, 입력창 멘션 15개
  - Target: MentionSuggest
  - Expected State: Notice="한 번에 멘션 가능한 횟수를 초과했습니다."
  - Evidence: Screenshot, OCR

### 채팅방 타입별 적용

- **Check Point**: 단체채팅방(일반·비밀·오픈채팅)에서 @입력 시 멘션 서제스트 UI가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 입력창 선택 → @문자 입력
  - Preconditions: 단체채팅방(일반/비밀/오픈채팅)
  - Target: MentionSuggest
  - Expected State: MentionSuggest=Shown
  - Evidence: Screenshot
- **Check Point**: 1:1 채팅방(일반·채널·비밀·오픈채팅) 및 나와의채팅에서 @입력 시 멘션 서제스트 UI가 미표시되고 @문자열 그대로 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 입력창 선택 → @문자 입력
  - Preconditions: 1:1 채팅방(일반/채널/비밀/오픈채팅) 또는 나와의채팅(메모)
  - Target: MentionSuggest
  - Expected State: MentionSuggest=Hidden
  - Evidence: Screenshot

### 이모트 타입별 멘션 적용

- **Check Point**: 애니콘·스티커·움직이는스티커·액션콘·큰이모티콘 + 텍스트에 멘션 포함 전송 시 멘션 적용 말풍선이 송·수신측에 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 이모트+멘션+텍스트 입력 → 전송
  - Preconditions: 단체채팅방, 이모트 타입(애니콘6/스티커12/움직이는스티커20/액션콘22/큰이모티콘25)
  - Target: Bubble
  - Expected State: Mention=AppliedBothSides
  - Evidence: Screenshot, APIResponse

## 멘션 닉네임 참조 표시

### 발신인 저장·수신인 수정

- **Check Point**: 발신인(A) 화면에서 멘션 대상(C)이 발신인이 연락처에 저장한 이름으로 표시된다.
  - Execution Path: 멘션 메시지 전송 → 발신인 화면에서 닉네임 확인
  - Preconditions: 발신인(A): C 이름 연락처 저장, 표시면(말풍선/장문 전체보기/채팅방 목록)
  - Target: Mention
  - Expected State: Mention.Name=SenderSavedName
  - Evidence: Screenshot, OCR
- **Check Point**: 수신인(B) 화면에서 멘션 대상(C)이 수신인이 톡에서 수정한 닉네임으로 표시된다.
  - Execution Path: 멘션 메시지 수신 → 수신인 화면에서 닉네임 확인
  - Preconditions: 수신인(B): C 닉네임 톡에서 수정, 표시면(말풍선/장문 전체보기/미리보기/푸시메시지/채팅방 목록/스크롤락)
  - Target: Mention
  - Expected State: Mention.Name=ReceiverEditedName
  - Evidence: Screenshot, OCR
- **Check Point**: 멘션 대상(C) 화면에서 본인 이름으로 표시된다.
  - Execution Path: 멘션 메시지 수신 → 멘션 대상 화면에서 닉네임 확인
  - Preconditions: 표시면(말풍선/장문 전체보기/미리보기/푸시메시지/채팅방 목록/스크롤락)
  - Target: Mention
  - Expected State: Mention.Name=SelfName
  - Evidence: Screenshot, OCR

### 발신인 수정·수신인 연락처

- **Check Point**: 발신인(A) 화면에서 멘션 대상(C)이 발신인이 톡에서 수정한 닉네임으로 표시된다.
  - Execution Path: 멘션 메시지 전송 → 발신인 화면에서 닉네임 확인
  - Preconditions: 발신인(A): C 닉네임 톡에서 수정, 표시면(말풍선/장문 전체보기/채팅방 목록)
  - Target: Mention
  - Expected State: Mention.Name=SenderEditedName
  - Evidence: Screenshot, OCR
- **Check Point**: 수신인(B) 화면에서 멘션 대상(C)이 수신인이 연락처에 저장한 이름으로 표시된다.
  - Execution Path: 멘션 메시지 수신 → 수신인 화면에서 닉네임 확인
  - Preconditions: 수신인(B): C 이름 연락처 저장, 표시면(말풍선/장문 전체보기/미리보기/푸시메시지/채팅방 목록/스크롤락)
  - Target: Mention
  - Expected State: Mention.Name=ReceiverSavedName
  - Evidence: Screenshot, OCR
- **Check Point**: 멘션 대상(C) 화면에서 본인 이름으로 표시된다.
  - Execution Path: 멘션 메시지 수신 → 멘션 대상 화면에서 닉네임 확인
  - Preconditions: 표시면(말풍선/장문 전체보기/미리보기/푸시메시지/채팅방 목록/스크롤락)
  - Target: Mention
  - Expected State: Mention.Name=SelfName
  - Evidence: Screenshot, OCR

### 발신인 친구아님·수신인 친구

- **Check Point**: 발신인(A) 화면에서 멘션 대상(C)이 멘션 대상 본인의 이름으로 표시된다.
  - Execution Path: 멘션 메시지 전송 → 발신인 화면에서 닉네임 확인
  - Preconditions: 발신인(A): C 친구 아님, 표시면(말풍선/장문 전체보기/채팅방 목록)
  - Target: Mention
  - Expected State: Mention.Name=TargetOwnName
  - Evidence: Screenshot, OCR
- **Check Point**: 수신인(B) 화면에서 멘션 대상(C)이 멘션 대상 본인의 이름으로 표시된다.
  - Execution Path: 멘션 메시지 수신 → 수신인 화면에서 닉네임 확인
  - Preconditions: 수신인(B): C 친구(연락처 없음, 수정 없음), 표시면(말풍선/장문 전체보기/미리보기/푸시메시지/채팅방 목록/스크롤락)
  - Target: Mention
  - Expected State: Mention.Name=TargetOwnName
  - Evidence: Screenshot, OCR
- **Check Point**: 멘션 대상(C) 화면에서 본인 이름으로 표시된다.
  - Execution Path: 멘션 메시지 수신 → 멘션 대상 화면에서 닉네임 확인
  - Preconditions: 표시면(말풍선/장문 전체보기/미리보기/푸시메시지/채팅방 목록/스크롤락)
  - Target: Mention
  - Expected State: Mention.Name=SelfName
  - Evidence: Screenshot, OCR

## 비동기 메시지 전송

### 네트워크 불안정 - 전송 실패 표시

- **Check Point**: 비행기모드에서 이모티콘·텍스트·사진·연락처 전송 시 Android는 말풍선 좌측 하단에 종이비행기가 표시된 상태로 남는다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 메시지 전송
  - Preconditions: OS=Android, 비행기모드
  - Target: Bubble
  - Expected State: SendStatus=PaperPlane
  - Evidence: Screenshot
- **Check Point**: 비행기모드에서 동일 메시지 전송 시 iOS는 메시지 전송 실패 아이콘이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 메시지 전송
  - Preconditions: OS=iOS, 비행기모드
  - Target: Bubble
  - Expected State: SendStatus=FailIcon
  - Evidence: Screenshot

### 네트워크 불안정 - 프로그레스바

- **Check Point**: 네트워크 불안정 상태에서 동영상 전송 시 프로그레스바가 노출되며 전송되지 않는다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 동영상 전송
  - Preconditions: 네트워크 불안정
  - Target: ProgressBar
  - Expected State: ProgressBar=Shown, Sent=No
  - Evidence: Screenshot
- **Check Point**: 동영상 전송 시 Android는 압축 중 프로그레스바가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 동영상 전송
  - Preconditions: OS=Android, 네트워크 불안정
  - Target: ProgressBar
  - Expected State: ProgressBar=Compressing
  - Evidence: Screenshot
- **Check Point**: 동영상 전송 시 iOS는 압축 후 동영상 길이와 프로그레스바가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 동영상 전송
  - Preconditions: OS=iOS, 네트워크 불안정
  - Target: ProgressBar
  - Expected State: ProgressBar=Shown, Duration=Shown
  - Evidence: Screenshot

### 네트워크 불안정 - 전송 불가

- **Check Point**: 네트워크 불안정 상태에서 보이스톡 실행 시 Android는 토스트가 노출되고 보이스톡 말풍선이 미노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 보이스톡 실행
  - Preconditions: OS=Android, 네트워크 불안정
  - Target: Toast
  - Expected State: Toast="일시적인 네트워크 오류로 통화가 종료되었습니다. 잠시 후 다시 시도해주세요. (1:0).", Bubble=None
  - Evidence: Screenshot, OCR
- **Check Point**: 네트워크 불안정 상태에서 보이스톡 실행 시 iOS는 팝업이 노출되고 보이스톡 말풍선이 미노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 보이스톡 실행
  - Preconditions: OS=iOS, 네트워크 불안정
  - Target: Alert
  - Expected State: Alert="네트워크 연결 상태가 좋지 않습니다. 확인 후 다시 시도해주세요.", Bubble=None
  - Evidence: Screenshot, OCR

### 네트워크 회복 - 자동/실패 처리

- **Check Point**: 네트워크 회복 시 종이비행기 표시 메시지(이모티콘·텍스트·사진·연락처·지도)가 자동으로 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 네트워크 원활 상태로 변경
  - Preconditions: 네트워크 불안정 시 전송한 메시지 존재
  - Target: Bubble
  - Expected State: AutoSend=Done
  - Evidence: Screenshot, APIResponse
- **Check Point**: 지도를 한 번도 호출한 적 없는 상태면 지도에 진입하지 않고 오류 토스트가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 네트워크 원활 상태로 변경
  - Preconditions: 지도 기능 미호출 이력, 지도 메시지 대기
  - Target: Toast
  - Expected State: Toast=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 네트워크 회복 후 로코 재접속 시 Android는 대기 중이던 동영상·음성 메시지가 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 로코 재접속
  - Preconditions: OS=Android, 네트워크 불안정 시 전송한 동영상·음성 존재
  - Target: Bubble
  - Expected State: MessageSent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 네트워크 회복 후 로코 재접속 시 iOS는 전송 실패로 처리되고 말풍선 좌측 하단에 재전송·삭제 버튼이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입 → 로코 재접속
  - Preconditions: OS=iOS, 네트워크 불안정 시 전송한 동영상·음성 존재
  - Target: Bubble
  - Expected State: SendStatus=Failed, Buttons=[Resend,Delete]
  - Evidence: Screenshot

# 검색·태그

> 검증 그룹 8 · 항목 30 · 체크포인트 134

## 채팅방 메시지 검색

### 빈 검색어 검색 처리

- **Check Point**: 검색어 미입력 상태로 검색 시 검색 옵션에 '검색 결과 없음' 문구가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 검색 진입 → 검색 시도
  - Preconditions: OS=Android, 검색 키워드 미입력
  - Target: SearchOption
  - Expected State: SearchResultMessage=검색 결과 없음
  - Evidence: Screenshot, OCR
- **Check Point**: 검색어 미입력 상태에서 검색 결과 이동 화살표가 비활성화된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 검색 진입 → 검색 시도
  - Preconditions: OS=Android, 검색 키워드 미입력
  - Target: NavigationArrow
  - Expected State: NavigationArrow=Disabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 검색어 미입력 상태에서 검색(엔터) 버튼이 비활성화된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 검색 진입 → 검색 시도
  - Preconditions: OS=iOS, 검색 키워드 미입력
  - Target: SearchButton
  - Expected State: SearchButton=Disabled
  - Evidence: Screenshot, ComponentTree

### 검색 실행 및 결과 표시

- **Check Point**: 검색 실행 시 입력란에 입력한 검색어가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 검색 진입 → 검색어 입력 → 검색 탭
  - Preconditions: 검색 결과 존재
  - Target: SearchInput
  - Expected State: SearchInput.Text=검색어
  - Evidence: Screenshot, OCR
- **Check Point**: 검색 실행 시 채팅방 말풍선의 검색어가 하이라이트 처리된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 검색 진입 → 검색어 입력 → 검색 탭
  - Preconditions: 검색 결과 존재
  - Target: Bubble
  - Expected State: Keyword=Highlighted
  - Evidence: Screenshot
- **Check Point**: 검색 실행 시 검색 입력창에 검색어 삭제(X) 버튼이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 검색 진입 → 검색어 입력 → 검색 탭
  - Preconditions: 검색 결과 존재
  - Target: ClearButton
  - Expected State: ClearButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 검색 실행 시 검색 옵션에 전체 결과 수(1/N)가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 검색 진입 → 검색어 입력 → 검색 탭
  - Preconditions: 검색 결과 존재
  - Target: SearchOption
  - Expected State: ResultCount=1/N
  - Evidence: Screenshot, OCR
- **Check Point**: 검색 실행 시 결과 이동 화살표가 활성화된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 검색 진입 → 검색어 입력 → 검색 탭
  - Preconditions: 검색 결과 존재
  - Target: NavigationArrow
  - Expected State: NavigationArrow=Enabled
  - Evidence: Screenshot, ComponentTree

### 검색 결과 이동

- **Check Point**: 다음/이전 이동 시 해당 검색어 말풍선으로 포커스가 이동된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 검색 탭 → 다음/이전 결과 이동
  - Preconditions: 검색 결과 다수 존재
  - Target: ChatLog
  - Expected State: Focus=NextKeyword
  - Evidence: Screenshot, Video
- **Check Point**: 이동된 검색어 말풍선이 화면 중앙에 정렬되어 노출된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 검색 탭 → 다음/이전 결과 이동
  - Preconditions: 검색 결과 다수 존재
  - Target: Bubble
  - Expected State: Bubble.Align=Center
  - Evidence: Screenshot
- **Check Point**: 검색 완료 시 {현재 포커스}/{전체 결과 수} 형식으로 결과 수가 표시된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 검색 탭 → 결과 수 확인
  - Preconditions: 검색 결과 다수 존재(예: 50개)
  - Target: SearchOption
  - Expected State: ResultCount=1/50
  - Evidence: Screenshot, OCR
- **Check Point**: 화살표로 다음 결과 이동 시 현재 포커스 위치 값이 변경된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 검색 탭 → 화살표로 다음 결과 이동
  - Preconditions: 검색 결과 다수 존재(예: 50개)
  - Target: SearchOption
  - Expected State: ResultCount=2/50
  - Evidence: Screenshot, OCR

### 검색 결과 없음 처리

- **Check Point**: 검색 실행 전에는 검색 결과로 이동되지 않는다.
  - Execution Path: 검색 진입 → 검색어 입력
  - Preconditions: 검색 미실행
  - Target: ChatLog
  - Expected State: Navigation=None
  - Evidence: Screenshot, Video
- **Check Point**: 검색 결과가 없으면 검색 옵션에 '검색 결과 없음' 문구가 노출된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 검색 탭
  - Preconditions: 검색 결과 없음
  - Target: SearchOption
  - Expected State: SearchResultMessage=검색 결과 없음
  - Evidence: Screenshot, OCR
- **Check Point**: 검색 결과가 없으면 키패드가 올라온 상태로 유지된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 검색 탭
  - Preconditions: 검색 결과 없음
  - Target: Keyboard
  - Expected State: Keyboard=Opened
  - Evidence: Screenshot
- **Check Point**: 검색 결과가 없으면 결과 이동 화살표가 비활성화된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 검색 탭
  - Preconditions: 검색 결과 없음
  - Target: NavigationArrow
  - Expected State: NavigationArrow=Disabled
  - Evidence: Screenshot, ComponentTree

### 검색어 삭제·변경

- **Check Point**: 검색어 X 버튼 또는 키패드 delete 시 입력한 검색어가 삭제된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 검색 탭 → 검색어 삭제(X)
  - Preconditions: 검색 결과 노출 상태
  - Target: SearchInput
  - Expected State: SearchInput.Text=Empty
  - Evidence: Screenshot
- **Check Point**: 검색어 삭제 시 키패드가 올라온다.
  - Execution Path: 검색 진입 → 검색어 입력 → 검색 탭 → 검색어 삭제(X)
  - Preconditions: 검색 결과 노출 상태
  - Target: Keyboard
  - Expected State: Keyboard=Opened
  - Evidence: Screenshot
- **Check Point**: 검색어 변경 후 검색 실행 전에는 검색 결과가 업데이트되지 않는다.
  - Execution Path: 검색 진입 → 검색어 입력 → 검색 탭 → 이전 검색어 삭제 → 다른 검색어 입력
  - Preconditions: 검색 결과 노출 상태, 검색 미실행
  - Target: SearchResult
  - Expected State: SearchResult=NotUpdated
  - Evidence: Screenshot, Video
- **Check Point**: 검색어 변경 시 기존 검색 결과 수 표시가 삭제된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 검색 탭 → 이전 검색어 삭제 → 다른 검색어 입력
  - Preconditions: 검색 결과 노출 상태, 검색 미실행
  - Target: SearchOption
  - Expected State: ResultCount=Cleared
  - Evidence: Screenshot
- **Check Point**: 검색어 변경 시 결과 이동 화살표가 비활성화된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 검색 탭 → 이전 검색어 삭제 → 다른 검색어 입력
  - Preconditions: 검색 결과 노출 상태, 검색 미실행
  - Target: NavigationArrow
  - Expected State: NavigationArrow=Disabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 변경한 검색어로 검색 실행 시 검색 결과가 새로 업데이트된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 검색 탭 → 다른 검색어 입력 → 검색 탭
  - Preconditions: 검색 결과 노출 상태
  - Target: SearchResult
  - Expected State: SearchResult=Updated
  - Evidence: Screenshot, Video

## 검색 옵션

### 인물 필터링 설정

- **Check Point**: 인물필터 탭 시 '나' 다음 상대방 순서로 인물 목록이 노출된다.
  - Execution Path: 검색 진입 → 인물필터 탭
  - Preconditions: 참여 유저 존재
  - Target: PersonFilter
  - Expected State: FilterList.Order=Me>Others
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 특정 친구 선택 시 해당 유저가 보낸 모든 말풍선의 발신자 이름이 하이라이트 처리된다.
  - Execution Path: 검색 진입 → 인물필터 탭 → 특정 친구 탭
  - Preconditions: 참여 유저 존재
  - Target: Bubble
  - Expected State: SenderName=Highlighted
  - Evidence: Screenshot
- **Check Point**: 인물필터와 키워드 검색 시 입력란에 선택된 유저 필터와 검색어가 함께 표시된다.
  - Execution Path: 검색 진입 → 인물필터 탭 → 특정 친구 탭 → 키워드 입력 → 검색 탭
  - Preconditions: 참여 유저 존재
  - Target: SearchInput
  - Expected State: SearchInput=UserFilter+Keyword
  - Evidence: Screenshot, OCR
- **Check Point**: 인물필터와 키워드 검색 시 필터링된 유저 말풍선의 키워드가 하이라이트 처리된다.
  - Execution Path: 검색 진입 → 인물필터 탭 → 특정 친구 탭 → 키워드 입력 → 검색 탭
  - Preconditions: 참여 유저 존재
  - Target: Bubble
  - Expected State: Keyword=Highlighted
  - Evidence: Screenshot
- **Check Point**: 인물필터와 키워드 검색 시 검색 결과 수가 해당 유저 말풍선의 키워드 수로 표시된다.
  - Execution Path: 검색 진입 → 인물필터 탭 → 특정 친구 탭 → 키워드 입력 → 검색 탭
  - Preconditions: 참여 유저 존재
  - Target: SearchOption
  - Expected State: ResultCount=UserKeywordCount
  - Evidence: Screenshot, OCR

### 인물 필터링 해제

- **Check Point**: 인물필터 X 버튼 또는 delete 시 인물필터가 삭제되고 필터링이 해제된다.
  - Execution Path: 검색 진입 → 인물필터 설정 → 인물필터 [X] 탭
  - Preconditions: 인물 필터링 설정 상태
  - Target: PersonFilter
  - Expected State: PersonFilter=Removed
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 인물필터 해제 시 검색 결과 수 표시가 삭제된다.
  - Execution Path: 검색 진입 → 인물필터 설정 → 인물필터 [X] 탭
  - Preconditions: 인물 필터링 설정 상태
  - Target: SearchOption
  - Expected State: ResultCount=Cleared
  - Evidence: Screenshot
- **Check Point**: 인물필터 해제 시 키패드가 올라온다.
  - Execution Path: 검색 진입 → 인물필터 설정 → 인물필터 [X] 탭
  - Preconditions: 인물 필터링 설정 상태
  - Target: Keyboard
  - Expected State: Keyboard=Opened
  - Evidence: Screenshot

### 타임머신

- **Check Point**: 타임머신 탭 시 날짜 선택 팝업이 노출된다.
  - Execution Path: 검색 진입 → 타임머신 탭
  - Preconditions: OS=Android
  - Target: TimeMachine
  - Expected State: TimeMachine=Popup
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 타임머신 탭 시 날짜 선택 하프뷰가 노출된다.
  - Execution Path: 검색 진입 → 타임머신 탭
  - Preconditions: OS=iOS
  - Target: TimeMachine
  - Expected State: TimeMachine=HalfView
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 특정 날짜 선택 시 해당 날짜 피드로 이동된다.
  - Execution Path: 검색 진입 → 타임머신 탭 → 특정 날짜 탭
  - Preconditions: 검색어 입력 없음
  - Target: ChatLog
  - Expected State: Feed=MovedToDate
  - Evidence: Screenshot, Video
- **Check Point**: 검색어가 있는 상태에서 타임머신 날짜 선택 시 기존 검색 결과가 초기화된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 타임머신 탭 → 특정 날짜 탭
  - Preconditions: 검색어 입력 있음
  - Target: SearchResult
  - Expected State: SearchResult=Reset
  - Evidence: Screenshot
- **Check Point**: 타임머신 날짜 선택 시 이전 검색 결과 하이라이트가 초기화된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 타임머신 탭 → 특정 날짜 탭
  - Preconditions: 검색어 입력 있음
  - Target: Bubble
  - Expected State: Highlight=Cleared
  - Evidence: Screenshot
- **Check Point**: 타임머신 이동 후 화살표로 이전/다음 검색 결과로 이동된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 타임머신 탭 → 특정 날짜 탭 → 화살표 이전/다음 탭
  - Preconditions: 검색어 입력 있음
  - Target: NavigationArrow
  - Expected State: Focus=Prev/Next
  - Evidence: Screenshot, Video

### 책갈피

- **Check Point**: 책갈피의 특정 말풍선 선택 시 기존 검색 결과가 초기화된다.
  - Execution Path: 검색 진입 → 책갈피 탭 → 특정 말풍선 탭
  - Preconditions: 검색어 입력 있음, 책갈피 설정 상태
  - Target: SearchResult
  - Expected State: SearchResult=Reset
  - Evidence: Screenshot
- **Check Point**: 책갈피 이동 시 이전 검색 결과 하이라이트가 초기화된다.
  - Execution Path: 검색 진입 → 책갈피 탭 → 특정 말풍선 탭
  - Preconditions: 검색어 입력 있음, 책갈피 설정 상태
  - Target: Bubble
  - Expected State: Highlight=Cleared
  - Evidence: Screenshot
- **Check Point**: 책갈피 선택 시 해당 책갈피 말풍선으로 이동된다.
  - Execution Path: 검색 진입 → 책갈피 탭 → 특정 말풍선 탭
  - Preconditions: 검색어 입력 있음, 책갈피 설정 상태
  - Target: ChatLog
  - Expected State: Feed=MovedToBookmark
  - Evidence: Screenshot, Video
- **Check Point**: 책갈피 이동 후 화살표로 이전/다음 검색 결과로 이동된다.
  - Execution Path: 검색 진입 → 책갈피 탭 → 특정 말풍선 탭 → 화살표 이전/다음 탭
  - Preconditions: 검색어 입력 있음, 책갈피 설정 상태
  - Target: NavigationArrow
  - Expected State: Focus=Prev/Next
  - Evidence: Screenshot, Video

### 화살표 이동 한계

- **Check Point**: 위쪽 화살표로 첫 검색 결과까지 이동하면 별도 얼럿 없이 위쪽 화살표가 비활성화된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 검색 탭 → [⋀] 버튼 끝까지 탭
  - Preconditions: 이전 검색 결과 없음
  - Target: NavigationArrow
  - Expected State: UpArrow=Disabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 아래쪽 화살표로 마지막 검색 결과까지 이동하면 별도 얼럿 없이 아래쪽 화살표가 비활성화된다.
  - Execution Path: 검색 진입 → 검색어 입력 → 검색 탭 → [⋁] 버튼 끝까지 탭
  - Preconditions: 다음 검색 결과 없음
  - Target: NavigationArrow
  - Expected State: DownArrow=Disabled
  - Evidence: Screenshot, ComponentTree

## 샵(#) 검색

### 샵검색 진입

- **Check Point**: 입력창 [#] 버튼 탭 시 + 메뉴 버튼이 X 버튼으로 변경된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 입력창 [#] 탭
  - Preconditions: 툴바 ON
  - Target: InputToolbar
  - Expected State: PlusButton=X
  - Evidence: Screenshot, ComponentTree
- **Check Point**: [#] 버튼 탭 시 입력창 위로 샵검색 레이어(UI)가 노출된다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭
  - Preconditions: 툴바 ON
  - Target: SharpSearch
  - Expected State: SharpSearchLayer=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 샵검색 진입 시 상단에 추천 게임/검색어(추천 키워드)가 노출된다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭
  - Preconditions: 툴바 ON
  - Target: RecommendKeyword
  - Expected State: RecommendKeyword=Shown
  - Evidence: Screenshot
- **Check Point**: 샵검색 모드에서 검색어 입력 안내문구가 노출된다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭
  - Preconditions: 툴바 ON
  - Target: SharpSearch
  - Expected State: Placeholder=# 검색어 입력
  - Evidence: Screenshot, OCR
- **Check Point**: 샵검색 모드에서 채팅방 입력창 좌측에 [X] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭
  - Preconditions: 툴바 ON
  - Target: SharpSearch
  - Expected State: CloseButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 샵검색 모드 진입 시 툴바가 비활성화된다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭
  - Preconditions: 툴바 ON
  - Target: Toolbar
  - Expected State: Toolbar=Disabled
  - Evidence: Screenshot, ComponentTree

### 샵검색 서제스트

- **Check Point**: 샵검색 단어 입력 시 서제스트 결과 3개가 노출된다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭 → 샵검색어 입력
  - Preconditions: 이전 검색결과 없음
  - Target: SuggestList
  - Expected State: SuggestList.Count=3
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 서제스트 항목의 (↙️) 아이콘 선택 시 입력창이 해당 매칭 단어로 변경된다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭 → 샵검색어 입력 → 서제스트 (↙️) 선택
  - Preconditions: 이전 검색결과 없음
  - Target: SharpSearch
  - Expected State: SearchInput=MatchedWord
  - Evidence: Screenshot, OCR
- **Check Point**: 서제스트 공유하기 선택 시 해당 검색결과가 채팅방에 공유된다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭 → 샵검색어 입력 → 서제스트 공유하기 선택
  - Preconditions: 이전 검색결과 없음
  - Target: Bubble
  - Expected State: SearchResult=Shared
  - Evidence: Screenshot, APIResponse
- **Check Point**: 서제스트의 돋보기 선택 시 샵검색 검색결과 페이지로 랜딩된다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭 → 샵검색어 입력 → 돋보기 선택
  - Preconditions: 이전 검색결과 없음
  - Target: SharpSearch
  - Expected State: Landing=SearchResultPage
  - Evidence: Screenshot, Video
- **Check Point**: 이전 검색 기록이 있으면 해당 서제스트 항목에 시계 아이콘(🕖)이 노출된다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭 → 이전 검색어 입력
  - Preconditions: 이전 검색결과 있음
  - Target: SuggestList
  - Expected State: HistoryIcon=Shown
  - Evidence: Screenshot
- **Check Point**: 이전 검색 기록 항목에 삭제(X) 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭 → 이전 검색어 입력
  - Preconditions: 이전 검색결과 있음
  - Target: SuggestList
  - Expected State: DeleteButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 검색 기록 항목의 (X) 버튼 선택 시 시계 아이콘과 X 버튼이 사라진다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭 → 이전 검색어 입력 → 서제스트 (X) 선택
  - Preconditions: 이전 검색결과 있음
  - Target: SuggestList
  - Expected State: HistoryIcon=Removed
  - Evidence: Screenshot

### 샵검색 결과 공유·종료

- **Check Point**: 샵검색 입력창에 긴 텍스트 입력 시 줄바꿈 없이 한 줄 내에서 가로로 길어진다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭 → 30자 이상 텍스트 입력
  - Preconditions: 툴바 ON
  - Target: SharpSearch
  - Expected State: InputLine=SingleLine
  - Evidence: Screenshot
- **Check Point**: 샵검색 모드에서 [X] 버튼 선택 시 샵검색 모드가 종료된다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭 → [X] 버튼 선택
  - Preconditions: 샵검색 모드 진입 상태
  - Target: SharpSearch
  - Expected State: SharpSearch=Exited
  - Evidence: Screenshot, ComponentTree
- **Check Point**: #검색어 입력 후 검색 버튼 탭 시 샵검색 검색 결과로 이동된다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭 → 검색어 입력 → 검색 버튼 탭
  - Preconditions: 샵검색 진입 상태
  - Target: SharpSearch
  - Expected State: Landing=SearchResultPage
  - Evidence: Screenshot, Video
- **Check Point**: 검색 결과를 채팅방에 공유 시 #검색 결과 말풍선이 전송된다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭 → 검색어 입력 → 검색 결과 → 채팅방에 공유
  - Preconditions: 샵검색 진입 상태
  - Target: Bubble
  - Expected State: SearchResultBubble=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 추천 검색어 탭 시 샵검색 검색 결과(카드뷰)로 이동된다.
  - Execution Path: 채팅방 진입 → 입력창 [#] 탭 → 키워드 입력 → 추천 검색어 탭
  - Preconditions: #검색 진입 상태
  - Target: SharpSearch
  - Expected State: Landing=SearchResultCard
  - Evidence: Screenshot, Video

## 태그 설정·해제

### 숏컷으로 태그 설정

- **Check Point**: 말풍선 롱탭 시 메뉴 상단에 태그 숏컷 목록이 순서대로 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 말풍선 롱탭
  - Preconditions: 나와의 채팅방
  - Target: TagShortcut
  - Expected State: TagShortcut=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 태그 숏컷에 디폴트 태그 5개가 고정 노출된다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 태그 숏컷 확인
  - Preconditions: 나와의 채팅방
  - Target: TagShortcut
  - Expected State: DefaultTag.Count=5
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 특정 태그 선택 시 태그 목록이 닫히고 말풍선에 선택한 태그가 추가된다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 태그 숏컷 → 특정 태그 탭
  - Preconditions: 나와의 채팅방
  - Target: Bubble
  - Expected State: Tag=Added
  - Evidence: Screenshot, DB
- **Check Point**: 추가한 태그가 숏컷 목록 첫 번째 순서에 노출된다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 태그 숏컷 → 특정 태그 탭 → 숏컷 목록 확인
  - Preconditions: 나와의 채팅방
  - Target: TagShortcut
  - Expected State: RecentTag.Order=First
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 선택된 태그 아이콘에 선택 표시(테두리)가 노출된다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 태그 숏컷 → 특정 태그 탭 → 숏컷 목록 확인
  - Preconditions: 나와의 채팅방
  - Target: TagShortcut
  - Expected State: SelectedTag=Bordered
  - Evidence: Screenshot

### 태그 개수 제한

- **Check Point**: 말풍선에 태그 3개가 있는 상태에서 태그 추가 시 최대 개수 초과 에러 팝업이 노출된다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 태그 숏컷 → 특정 태그 탭
  - Preconditions: 나와의 채팅방, 하나의 말풍선에 태그 3개 추가됨
  - Target: Alert
  - Expected State: Alert=Shown(태그는 최대 3개까지 추가할 수 있습니다.)
  - Evidence: Screenshot, OCR
- **Check Point**: 전체 태그 수 상한에 도달한 상태에서 태그 추가 시 최대 개수 초과 에러 팝업이 노출된다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 특정 태그 탭
  - Preconditions: 나와의 채팅방, 전체 태그 수 상한 도달(Sandbox=50/Real=5000)
  - Target: Alert
  - Expected State: Alert=Shown(나와의 채팅방에서 태그는 최대 %d개까지 추가할 수 있습니다.)
  - Evidence: Screenshot, OCR

### 태그 해제

- **Check Point**: 선택된 태그를 다시 탭하면 태그 목록이 닫히고 말풍선의 태그가 해제된다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 태그 숏컷 → 선택된 태그 탭
  - Preconditions: 나와의 채팅방, 말풍선에 태그 추가됨
  - Target: Bubble
  - Expected State: Tag=Removed
  - Evidence: Screenshot, DB
- **Check Point**: 태그 해제 후 해당 태그가 선택 해제 상태로 노출된다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 태그 숏컷 → 선택된 태그 탭 → 태그 목록 확인
  - Preconditions: 나와의 채팅방, 말풍선에 태그 추가됨
  - Target: TagShortcut
  - Expected State: Tag=Deselected
  - Evidence: Screenshot

### 말풍선 태그 노출 순서

- **Check Point**: 말풍선 우하단에 추가된 태그가 태그 id 순으로 노출된다.
  - Execution Path: 채팅방 진입 → 말풍선에 추가된 태그 확인
  - Preconditions: 나와의 채팅방, 말풍선에 태그 다수 추가됨
  - Target: Bubble
  - Expected State: TagBadge.Order=ByTagId
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 태그 편집 화면에서 말풍선에 추가된 태그가 선택 상태(테두리)로 표시된다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 태그 탭 → 숏컷 목록 확인
  - Preconditions: 나와의 채팅방, 말풍선에 추가된 태그가 최근 태그 목록에 있음
  - Target: TagEditor
  - Expected State: SelectedTag=Bordered
  - Evidence: Screenshot

## 태그 목록·편집

### 태그 전체 바텀시트

- **Check Point**: 태그 전체보기(>) 버튼 탭 시 태그 전체 바텀시트가 노출된다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 태그 목록 → 전체보기(>) 탭
  - Preconditions: 나와의 채팅방
  - Target: TagBottomSheet
  - Expected State: TagBottomSheet=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 최근 추가한 태그가 없으면 최근 사용 목록이 노출되지 않는다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 태그 목록 → 전체보기(>) 탭
  - Preconditions: 나와의 채팅방, 최근에 추가한 태그 없음
  - Target: TagBottomSheet
  - Expected State: RecentSection=Hidden
  - Evidence: Screenshot
- **Check Point**: 전체 태그 목록 21개가 고정 순서로 노출된다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 태그 목록 → 전체보기(>) 탭
  - Preconditions: 나와의 채팅방
  - Target: TagBottomSheet
  - Expected State: AllTagList.Count=21
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 최근 추가한 태그가 있으면 바텀시트에 최근 사용 목록이 노출된다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 태그 목록 → 전체보기(>) 탭
  - Preconditions: 나와의 채팅방, 최근에 추가한 태그 있음
  - Target: TagBottomSheet
  - Expected State: RecentSection=Shown
  - Evidence: Screenshot
- **Check Point**: 최근 사용 목록에서 최신 태그가 첫 번째 순서로 노출된다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 태그 목록 → 전체보기(>) 탭
  - Preconditions: 나와의 채팅방, 최근에 추가한 태그 있음
  - Target: TagBottomSheet
  - Expected State: RecentTag.Order=NewestFirst
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 최근 사용 목록이 최대 1줄까지만 노출된다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 태그 목록 → 전체보기(>) 탭
  - Preconditions: 나와의 채팅방, 최근에 추가한 태그 있음
  - Target: TagBottomSheet
  - Expected State: RecentSection.MaxLine=1
  - Evidence: Screenshot

### 바텀시트로 태그 변경

- **Check Point**: 바텀시트에서 말풍선에 걸린 태그가 선택(클릭)된 상태로 노출된다.
  - Execution Path: 채팅방 진입 → 말풍선에 추가된 태그 탭 → 전체 바텀시트 확인
  - Preconditions: 나와의 채팅방, 이미 말풍선에 태그가 걸려있음
  - Target: TagBottomSheet
  - Expected State: TaggedTag=Selected
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 최근 사용 목록에 없는 태그는 최근 영역에 아이콘이 노출되지 않는다.
  - Execution Path: 채팅방 진입 → 말풍선에 추가된 태그 탭 → 전체 바텀시트 확인
  - Preconditions: 나와의 채팅방, 최근 사용 목록에 선택한 태그 없음
  - Target: TagBottomSheet
  - Expected State: RecentSection.Tag=Hidden
  - Evidence: Screenshot
- **Check Point**: 바텀시트에서 다른 태그 선택 시 목록이 닫히고 해당 태그가 추가된다.
  - Execution Path: 채팅방 진입 → 말풍선에 추가된 태그 탭 → 전체 바텀시트 → 다른 태그 탭
  - Preconditions: 나와의 채팅방, 이미 말풍선에 태그가 걸려있음
  - Target: Bubble
  - Expected State: Tag=Added
  - Evidence: Screenshot, DB

## 태그 필터 검색

### 태그 필터 노출 순서

- **Check Point**: 검색 화면 진입 시 말풍선에 태그가 많이 걸린 순서로 태그 필터가 노출된다.
  - Execution Path: 채팅방 진입 → 검색 화면 진입 → 태그 필터 순서 확인
  - Preconditions: 나와의 채팅방, 태그 필터 다수 존재
  - Target: TagFilter
  - Expected State: TagFilter.Order=ByCountDesc
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 태그 수가 동일한 경우 최근에 추가된 태그 순서로 노출된다.
  - Execution Path: 채팅방 진입 → 검색 화면 진입 → 태그 필터 순서 확인
  - Preconditions: 나와의 채팅방, 필터링된 태그 수가 동일한 태그 존재
  - Target: TagFilter
  - Expected State: TagFilter.Tiebreak=RecentFirst
  - Evidence: Screenshot, ComponentTree

### 태그 필터 ON/OFF

- **Check Point**: 특정 태그 필터 탭 시 해당 태그가 추가된 말풍선만 필터링되어 노출된다.
  - Execution Path: 채팅방 진입 → 검색 화면 진입 → 특정 태그 필터 탭
  - Preconditions: 나와의 채팅방, 필터 해제 상태
  - Target: TagFilter
  - Expected State: Filter=On
  - Evidence: Screenshot, DB
- **Check Point**: 태그 필터 적용 시 필터된 메시지 중 가장 최근 말풍선으로 포커스된다.
  - Execution Path: 채팅방 진입 → 검색 화면 진입 → 특정 태그 필터 탭
  - Preconditions: 나와의 채팅방, 필터 해제 상태
  - Target: ChatLog
  - Expected State: Focus=LatestBubble
  - Evidence: Screenshot, Video
- **Check Point**: 태그 필터 선택 시 해당 태그가 선택 상태로 노출된다.
  - Execution Path: 채팅방 진입 → 검색 화면 진입 → 특정 태그 필터 탭
  - Preconditions: 나와의 채팅방, 필터 해제 상태
  - Target: TagFilter
  - Expected State: SelectedTag=Selected
  - Evidence: Screenshot
- **Check Point**: 태그 필터를 탭하여 OFF로 전환 시 필터가 해제된다.
  - Execution Path: 채팅방 진입 → 검색 화면 진입 → 필터 탭하여 OFF 전환
  - Preconditions: 나와의 채팅방, 필터 ON 상태
  - Target: TagFilter
  - Expected State: Filter=Off
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 필터 해제 시 보고 있는 화면의 말풍선 기준으로 전체 챗로그가 노출된다.
  - Execution Path: 채팅방 진입 → 검색 화면 진입 → 필터 탭하여 OFF 전환
  - Preconditions: 나와의 채팅방, 필터 ON 상태
  - Target: ChatLog
  - Expected State: ChatLog=Full
  - Evidence: Screenshot, Video

## 플러스메뉴 카메라·미디어

### 카메라 촬영 메뉴 진입

- **Check Point**: 플러스메뉴 카메라 탭 시 촬영 메뉴 팝업(사진 촬영/동영상 촬영)이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 플러스메뉴 열기 → 카메라 탭
  - Preconditions: OS=Android, 카메라 접근 권한 허용
  - Target: Popup
  - Expected State: CameraMenu=Popup
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 플러스메뉴 카메라 탭 시 카메라가 실행되고 비디오/사진 메뉴가 제공된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 플러스메뉴 열기 → 카메라 탭
  - Preconditions: OS=iOS, 카메라 접근 권한 허용
  - Target: Camera
  - Expected State: Camera=Launched
  - Evidence: Screenshot

### 사진 촬영 전송

- **Check Point**: 사진 촬영 후 편집 없이 전송 시 촬영한 사진이 전송된다.
  - Execution Path: 플러스메뉴 열기 → 카메라 탭 → 사진 촬영 → 편집 없이 전송
  - Preconditions: 카메라 접근 권한 허용
  - Target: Bubble
  - Expected State: Photo=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 전송된 사진은 설정된 사진 화질 기준으로 전송된다.
  - Execution Path: 플러스메뉴 열기 → 카메라 탭 → 사진 촬영 → 편집 없이 전송
  - Preconditions: 전체 설정 > 채팅 > 사진 화질 설정 상태
  - Target: Bubble
  - Expected State: PhotoQuality=SettingBased
  - Evidence: APIResponse, DB
- **Check Point**: 촬영 후 편집 진입 시 편집 모드로 사진 편집이 가능하다.
  - Execution Path: 플러스메뉴 열기 → 카메라 탭 → 사진 촬영 → 편집 진입
  - Preconditions: 카메라 접근 권한 허용
  - Target: PhotoEditor
  - Expected State: PhotoEditor=Enabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 사진 편집기 상단에 설명문구 입력창이 노출된다.
  - Execution Path: 플러스메뉴 열기 → 카메라 탭 → 사진 촬영 → 편집 진입
  - Preconditions: 카메라 접근 권한 허용
  - Target: PhotoEditor
  - Expected State: CaptionInput=Shown
  - Evidence: Screenshot
- **Check Point**: 편집 후 전송 시 편집된 사진이 전송된다.
  - Execution Path: 플러스메뉴 열기 → 카메라 탭 → 사진 촬영 → 편집 → 전송
  - Preconditions: 카메라 접근 권한 허용
  - Target: Bubble
  - Expected State: Photo=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 촬영 후 다시 찍기 선택 시 촬영 모드로 전환된다.
  - Execution Path: 플러스메뉴 열기 → 카메라 탭 → 사진 촬영 → 다시 찍기 선택
  - Preconditions: 카메라 접근 권한 허용
  - Target: Camera
  - Expected State: Camera=RetakeMode
  - Evidence: Screenshot
- **Check Point**: 재촬영 후 전송 시 재촬영한 사진이 전송된다.
  - Execution Path: 플러스메뉴 열기 → 카메라 탭 → 사진 촬영 → 다시 찍기 → 재촬영 → 전송
  - Preconditions: 카메라 접근 권한 허용
  - Target: Bubble
  - Expected State: Photo=Sent
  - Evidence: Screenshot, APIResponse

### 동영상 촬영 전송

- **Check Point**: 동영상 촬영 후 편집 없이 전송 시 촬영한 동영상이 전송된다.
  - Execution Path: 플러스메뉴 열기 → 카메라 탭 → 동영상 촬영 → 편집 없이 전송
  - Preconditions: 카메라 접근 권한 허용
  - Target: Bubble
  - Expected State: Video=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 전송된 동영상은 설정된 동영상 화질 기준으로 전송된다.
  - Execution Path: 플러스메뉴 열기 → 카메라 탭 → 동영상 촬영 → 편집 없이 전송
  - Preconditions: 전체 설정 > 채팅 > 동영상 화질 설정 상태
  - Target: Bubble
  - Expected State: VideoQuality=SettingBased
  - Evidence: APIResponse, DB
- **Check Point**: 촬영 후 편집 진입 시 동영상 편집 모드로 편집이 가능하다.
  - Execution Path: 플러스메뉴 열기 → 카메라 탭 → 동영상 촬영 → 편집 진입
  - Preconditions: 카메라 접근 권한 허용
  - Target: VideoEditor
  - Expected State: VideoEditor=Enabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 동영상 편집기 상단에 설명문구 입력창이 노출된다.
  - Execution Path: 플러스메뉴 열기 → 카메라 탭 → 동영상 촬영 → 편집 진입
  - Preconditions: 카메라 접근 권한 허용
  - Target: VideoEditor
  - Expected State: CaptionInput=Shown
  - Evidence: Screenshot
- **Check Point**: 편집 후 전송 시 편집된 동영상이 전송된다.
  - Execution Path: 플러스메뉴 열기 → 카메라 탭 → 동영상 촬영 → 편집 → 전송
  - Preconditions: 카메라 접근 권한 허용
  - Target: Bubble
  - Expected State: Video=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 동영상 촬영 후 다시 찍기 선택 시 동영상 촬영 모드로 전환된다.
  - Execution Path: 플러스메뉴 열기 → 카메라 탭 → 동영상 촬영 → 다시 찍기 선택
  - Preconditions: 카메라 접근 권한 허용
  - Target: Camera
  - Expected State: Camera=RetakeMode
  - Evidence: Screenshot
- **Check Point**: 재촬영 후 전송 시 재촬영한 동영상이 전송된다.
  - Execution Path: 플러스메뉴 열기 → 카메라 탭 → 동영상 촬영 → 다시 찍기 → 재촬영 → 전송
  - Preconditions: 카메라 접근 권한 허용
  - Target: Bubble
  - Expected State: Video=Sent
  - Evidence: Screenshot, APIResponse

## 플러스메뉴 부가 기능 진입

### 선물하기

- **Check Point**: 1:1 채팅방에서 플러스메뉴 선물하기 탭 시 선물하기 전용 웹뷰가 구동된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 플러스메뉴 열기 → 선물하기 탭
  - Preconditions: 1:1 채팅방
  - Target: WebView
  - Expected State: WebView=GiftLaunched
  - Evidence: Screenshot
- **Check Point**: 선물하기 웹뷰에서 X 탭 시 선물하기가 종료되고 채팅방으로 복귀한다.
  - Execution Path: 플러스메뉴 열기 → 선물하기 탭 → 웹뷰에서 X 탭
  - Preconditions: 선물하기 웹뷰 구동 상태
  - Target: ChatRoom
  - Expected State: ChatRoom=Returned
  - Evidence: Screenshot
- **Check Point**: 그룹 채팅방에서 선물하기 탭 시 선물 액션시트(선물하기/두근두근 선물게임)가 노출된다.
  - Execution Path: 플러스메뉴 열기 → 선물하기 탭
  - Preconditions: 그룹 채팅방
  - Target: ActionSheet
  - Expected State: ActionSheet=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 그룹 선물 액션시트에서 선물하기 탭 시 선물하기 전용 웹뷰가 구동된다.
  - Execution Path: 플러스메뉴 열기 → 선물하기 탭 → 액션시트 > 선물하기 탭
  - Preconditions: 그룹 채팅방
  - Target: WebView
  - Expected State: WebView=GiftLaunched
  - Evidence: Screenshot
- **Check Point**: 그룹 선물 액션시트에서 두근두근 선물게임 탭 시 해당 웹뷰가 구동된다.
  - Execution Path: 플러스메뉴 열기 → 선물하기 탭 → 액션시트 > 두근두근 선물게임 탭
  - Preconditions: 그룹 채팅방
  - Target: WebView
  - Expected State: WebView=GiftGameLaunched
  - Evidence: Screenshot

### 통화하기

- **Check Point**: 플러스메뉴 통화하기 탭 시 통화 타입 선택 UI(보이스톡/페이스톡)가 표시된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 통화하기 탭
  - Preconditions: 일반 1:1 또는 그룹 채팅방
  - Target: CallTypeSelector
  - Expected State: CallTypeSelector=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 오픈 1:1 채팅방에서는 통화 타입 중 페이스톡이 제공되지 않는다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 통화하기 탭
  - Preconditions: 오픈 1:1 채팅방
  - Target: CallTypeSelector
  - Expected State: FaceTalk=NotProvided
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 채팅방 우상단 통화하기 버튼 탭 시 바텀시트에 통화 타입(보이스톡/페이스톡)이 표시된다.
  - Execution Path: 채팅방 진입 → 우상단 통화하기(📞) 버튼 탭
  - Preconditions: 일반 1:1 채팅방
  - Target: BottomSheet
  - Expected State: CallTypeSelector=BottomSheet
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 오픈 1:1 채팅방에서는 +메뉴에서 보이스톡만 제공된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 통화하기 탭
  - Preconditions: 오픈 1:1 채팅방
  - Target: CallTypeSelector
  - Expected State: VoiceTalkOnly=True
  - Evidence: Screenshot, ComponentTree

### 송금·톡클라우드

- **Check Point**: 1:1 채팅방에서 플러스메뉴 송금 탭 시 송금 액션시트가 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 송금 탭
  - Preconditions: 1:1 채팅방
  - Target: ActionSheet
  - Expected State: ActionSheet=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 그룹 채팅방에서 플러스메뉴 송금 탭 시 송금 액션시트가 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 송금 탭
  - Preconditions: 그룹 채팅방
  - Target: ActionSheet
  - Expected State: ActionSheet=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 플러스메뉴 톡클라우드 탭 시 톡클라우드 파일 전송하기 UI가 표시된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 톡클라우드 탭
  - Preconditions: -
  - Target: TalkCloud
  - Expected State: TalkCloudUI=Shown
  - Evidence: Screenshot, ComponentTree

### 일정·할 일

- **Check Point**: 플러스메뉴 일정 탭 시 일정 액션시트(일정 등록/할 일 등록)가 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 일정 탭
  - Preconditions: -
  - Target: ActionSheet
  - Expected State: ActionSheet=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 일정 등록 탭 시 일정 등록 풀뷰가 노출된다.
  - Execution Path: 플러스메뉴 열기 → 일정 탭 → 일정 등록 탭
  - Preconditions: -
  - Target: ScheduleEditor
  - Expected State: ScheduleEditor=FullView
  - Evidence: Screenshot
- **Check Point**: 정보 입력 후 등록하기 탭 시 일정 등록이 완료되고 일정 말풍선이 공유된다.
  - Execution Path: 일정 등록 탭 → 제목/시작/종료/초대/상세 입력 → 등록하기 탭
  - Preconditions: 그룹 채팅방
  - Target: Bubble
  - Expected State: ScheduleBubble=Shared
  - Evidence: Screenshot, APIResponse
- **Check Point**: 할 일 등록 탭 시 할 일 등록 풀뷰가 노출된다.
  - Execution Path: 플러스메뉴 열기 → 일정 탭 → 할 일 등록 탭
  - Preconditions: -
  - Target: TodoEditor
  - Expected State: TodoEditor=FullView
  - Evidence: Screenshot
- **Check Point**: 정보 입력 후 등록하기 탭 시 할 일 등록이 완료되고 완료 메시지가 출력된다.
  - Execution Path: 할 일 등록 탭 → 할 일/기한/반복 입력 → 등록하기 탭
  - Preconditions: -
  - Target: Bubble
  - Expected State: TodoRegistered=Message
  - Evidence: Screenshot, APIResponse

### 캡쳐

- **Check Point**: 말풍선이 없는 채팅방에서 캡쳐 탭 시 '캡쳐할 내용이 없습니다.' 토스트가 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 캡쳐 버튼 탭
  - Preconditions: OS=Android, 말풍선이 없는 채팅방
  - Target: Toast
  - Expected State: Toast=Shown(캡쳐할 내용이 없습니다.)
  - Evidence: Screenshot, OCR
- **Check Point**: 말풍선이 없는 채팅방에서 캡쳐 탭 시 '캡쳐할 내용이 없습니다.' 팝업이 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 캡쳐 버튼 탭
  - Preconditions: OS=iOS, 말풍선이 없는 채팅방
  - Target: Alert
  - Expected State: Alert=Shown(캡쳐할 내용이 없습니다.)
  - Evidence: Screenshot, OCR
- **Check Point**: 말풍선이 있는 채팅방에서 캡쳐 탭 시 캡처 영역 선택 모드로 화면이 전환된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 캡쳐 버튼 탭
  - Preconditions: 말풍선이 있는 채팅방
  - Target: CaptureMode
  - Expected State: CaptureMode=Entered
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 캡처 모드 상단에 '캡처를 시작할 말풍선을 선택해주세요.' 가이드 문구가 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 캡쳐 버튼 탭
  - Preconditions: 말풍선이 있는 채팅방
  - Target: CaptureMode
  - Expected State: GuideText=캡처를 시작할 말풍선을 선택해주세요.
  - Evidence: Screenshot, OCR
- **Check Point**: 캡처 모드에서 채팅 말풍선 영역이 딤드 상태로 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 캡쳐 버튼 탭
  - Preconditions: 말풍선이 있는 채팅방
  - Target: CaptureMode
  - Expected State: Bubble=Dimmed
  - Evidence: Screenshot
- **Check Point**: 캡처 모드 하단의 [저장]/[전달] 버튼이 비활성화 상태로 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 캡쳐 버튼 탭
  - Preconditions: 말풍선이 있는 채팅방, 말풍선 미선택
  - Target: CaptureMode
  - Expected State: SaveForwardButton=Disabled
  - Evidence: Screenshot, ComponentTree

### 연락처·파일

- **Check Point**: 플러스메뉴 연락처 탭 시 액션시트(카카오톡 프로필 보내기/연락처 보내기)가 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 연락처 버튼 탭
  - Preconditions: OS=Android
  - Target: ActionSheet
  - Expected State: ActionSheet=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 플러스메뉴 연락처 탭 시 바텀시트(카카오톡 프로필 보내기/연락처 보내기)가 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 연락처 버튼 탭
  - Preconditions: OS=iOS
  - Target: BottomSheet
  - Expected State: BottomSheet=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 플러스메뉴 파일 탭 시 파일 하프뷰로 전환된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 파일 버튼 탭
  - Preconditions: -
  - Target: FilePicker
  - Expected State: FilePicker=HalfView
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 파일 하프뷰의 핸들바로 풀뷰 전환이 가능하다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 파일 버튼 탭 → 핸들바 드래그
  - Preconditions: -
  - Target: FilePicker
  - Expected State: FilePicker=FullViewEnabled
  - Evidence: Screenshot
- **Check Point**: 최근에 보낸 파일이 없으면 [전체삭제] 버튼이 비활성화된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 파일 버튼 탭
  - Preconditions: 최근에 보낸 파일 없음
  - Target: FilePicker
  - Expected State: DeleteAllButton=Disabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 최근에 보낸 파일이 없으면 '최근에 보낸 파일이 없습니다.' 문구가 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 파일 버튼 탭
  - Preconditions: 최근에 보낸 파일 없음
  - Target: FilePicker
  - Expected State: EmptyMessage=최근에 보낸 파일이 없습니다.
  - Evidence: Screenshot, OCR
- **Check Point**: 최근에 보낸 파일이 있으면 [전체삭제] 버튼이 활성화된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 파일 버튼 탭
  - Preconditions: 최근에 보낸 파일 있음
  - Target: FilePicker
  - Expected State: DeleteAllButton=Enabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 최근에 보낸 파일이 있으면 파일 목록(썸네일+파일명)이 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 열기 → 파일 버튼 탭
  - Preconditions: 최근에 보낸 파일 있음
  - Target: FilePicker
  - Expected State: FileList=Shown
  - Evidence: Screenshot, ComponentTree

# 말풍선·컨텍스트 메뉴

> 검증 그룹 9 · 항목 39 · 체크포인트 125

## 채팅 영역·말풍선 기본 구성

### 채팅 영역 구성

- **Check Point**: 등록된 공지가 있는 경우 채팅 영역 상단에 공지가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입
  - Preconditions: 로그인 계정, 등록된 공지 존재
  - Target: Notice
  - Expected State: Notice=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 채팅 영역에 송·수신 말풍선 영역이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입
  - Preconditions: 로그인 계정, 송·수신 메시지 존재
  - Target: ChatLog
  - Expected State: MessageArea=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 채팅 영역에 날짜 피드메시지가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입
  - Preconditions: 로그인 계정, 서로 다른 날짜의 메시지 존재
  - Target: DateFeedMessage
  - Expected State: DateFeedMessage=Shown
  - Evidence: Screenshot, ComponentTree

### 송신 말풍선 구성

- **Check Point**: 내가 보낸 메시지는 우측에 말풍선으로 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 메시지 전송
  - Preconditions: 로그인 계정
  - Target: Bubble
  - Expected State: Bubble.Align=Right
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 송신 말풍선에 송신 시간이 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 메시지 전송
  - Preconditions: 로그인 계정
  - Target: Bubble
  - Expected State: SendTime=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 상대가 읽지 않은 경우 송신 말풍선에 '1'이 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 메시지 전송
  - Preconditions: 로그인 계정, 상대방 메시지 미확인
  - Target: UnreadCount
  - Expected State: UnreadCount=1
  - Evidence: Screenshot, OCR

### 수신 말풍선 구성

- **Check Point**: 수신 말풍선에 상대방 프로필 이미지가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 메시지 수신
  - Preconditions: 로그인 계정, 상대방 메시지 수신
  - Target: ProfileImage
  - Expected State: ProfileImage=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 수신 말풍선에 상대방 닉네임이 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 메시지 수신
  - Preconditions: 로그인 계정, 상대방 메시지 수신
  - Target: Nickname
  - Expected State: Nickname=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 수신 말풍선에 수신 시간이 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 메시지 수신
  - Preconditions: 로그인 계정, 상대방 메시지 수신
  - Target: Bubble
  - Expected State: ReceiveTime=Shown
  - Evidence: Screenshot, OCR

### 스크롤 인디케이터 및 하단 이동

- **Check Point**: 채팅방 스크롤 중 스크롤바에 현재 화면 대화의 날짜 버블이 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 채팅방 스크롤
  - Preconditions: 로그인 계정, 수·발신 메시지 한 페이지 이상 존재
  - Target: ScrollIndicator
  - Expected State: DateBubble=Shown
  - Evidence: Screenshot, Video
- **Check Point**: 스크롤을 멈추면 날짜 버블이 사라진다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 채팅방 스크롤 → 스크롤 정지
  - Preconditions: 로그인 계정, 수·발신 메시지 한 페이지 이상 존재
  - Target: ScrollIndicator
  - Expected State: DateBubble=Hidden
  - Evidence: Video
- **Check Point**: 과거 대화 스크롤 시 우측 하단에 아래로 바로가기(V) 버튼이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 과거 대화 스크롤
  - Preconditions: 로그인 계정, 한 화면 이상 스크롤 가능한 챗로그
  - Target: ScrollToBottomButton
  - Expected State: ScrollToBottomButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 아래로 바로가기(V) 버튼 탭 시 채팅방 라스트 메시지로 이동된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 과거 대화 스크롤 → V 버튼 탭
  - Preconditions: 로그인 계정, 한 화면 이상 스크롤 가능한 챗로그
  - Target: ScrollToBottomButton
  - Expected State: Scroll=Bottom
  - Evidence: Screenshot, Video
- **Check Point**: 새 메시지 배너 탭 시 최하단으로 이동되며 라스트 메시지가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 새 메시지 배너 탭
  - Preconditions: 로그인 계정, 안읽은 메시지 11개 이상
  - Target: NewMessageBanner
  - Expected State: Scroll=Bottom
  - Evidence: Screenshot, Video

### 특수 피드·레이어

- **Check Point**: 유실선 생성 동작 수행 시 챗로그 유실선이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 유실선 생성 동작 수행
  - Preconditions: 로그인 계정, Sandbox 환경
  - Target: ChatLogLossLine
  - Expected State: ChatLogLossLine=Shown
  - Evidence: Screenshot, Log
- **Check Point**: 날짜 피드메시지(타임머신 영역) 탭 시 캘린더 레이어가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 타임머신 영역 탭
  - Preconditions: 로그인 계정, 대화 이력 존재
  - Target: Calendar
  - Expected State: Calendar=HalfView
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 캘린더 레이어가 마지막 대화가 발생한 달로 열린다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 타임머신 영역 탭
  - Preconditions: 로그인 계정, 대화 이력 존재
  - Target: Calendar
  - Expected State: Calendar.Month=LastChatMonth
  - Evidence: Screenshot, OCR

## 전송 실패·네트워크 상태

### 전송 실패 표시

- **Check Point**: 전송 실패 시 송신 말풍선 좌측에 재시도 아이콘이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 메시지 전송
  - Preconditions: 로그인 계정, 비행기모드 10분 대기로 전송 실패 유발
  - Target: RetryIcon
  - Expected State: RetryIcon=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 전송 실패 시 송신 말풍선 좌측에 삭제 아이콘이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 메시지 전송
  - Preconditions: 로그인 계정, 비행기모드 10분 대기로 전송 실패 유발
  - Target: DeleteIcon
  - Expected State: DeleteIcon=Shown
  - Evidence: Screenshot, ComponentTree

### 전송 실패 재시도

- **Check Point**: 재시도 아이콘 탭 시 '재전송하시겠습니까?' 재전송 얼럿이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 재시도 아이콘 탭
  - Preconditions: 로그인 계정, OS=Android, 전송 실패 말풍선 존재
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 재시도 아이콘 탭 시 [재전송][삭제] 바텀시트가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 재시도 아이콘 탭
  - Preconditions: 로그인 계정, OS=iOS, 전송 실패 말풍선 존재
  - Target: BottomSheet
  - Expected State: BottomSheet=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: [재전송] 선택 시 메시지가 재전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 재시도 아이콘 탭 → [재전송] 탭
  - Preconditions: 로그인 계정, 전송 실패 말풍선 존재, 네트워크 정상
  - Target: Message
  - Expected State: MessageStatus=Resent
  - Evidence: Screenshot, APIResponse

### 전송 실패 삭제

- **Check Point**: 삭제 아이콘 탭 후 [삭제] 선택 시 전송 실패 메시지가 삭제된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 삭제 아이콘 탭 → [삭제] 탭
  - Preconditions: 로그인 계정, 전송 실패 말풍선 존재
  - Target: Message
  - Expected State: MessageDeleted
  - Evidence: Screenshot, ComponentTree

### 네트워크 불안정 전송

- **Check Point**: 네트워크 불안정 상태에서 텍스트 전송 시 종이비행기가 표시된 상태로 메시지가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 텍스트 입력 후 전송
  - Preconditions: 로그인 계정, 네트워크 불안정 상태
  - Target: Bubble
  - Expected State: SendingIndicator=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 네트워크 재접속(로코 재접속) 시 종이비행기로 표시된 메시지가 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 로코 재접속
  - Preconditions: 로그인 계정, 종이비행기 표시 메시지 존재
  - Target: Message
  - Expected State: MessageStatus=Sent
  - Evidence: Screenshot, APIResponse

## 라이브 텍스트 (iOS 16)

### 라이브 텍스트 OFF - 툴바 뷰

- **Check Point**: 단일 말풍선 라이브 텍스트 버튼 선택 시 툴바 뷰로 바로 이동된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 단일 말풍선 라이브 텍스트 버튼 선택
  - Preconditions: 로그인 계정, OS=iOS 16, 라이브 텍스트 지원 단말, 라이브 텍스트 OFF
  - Target: Toolbar
  - Expected State: ToolbarView=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 툴바 뷰 우하단에 텍스트 인식 아이콘이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 단일 말풍선 라이브 텍스트 버튼 선택
  - Preconditions: 로그인 계정, OS=iOS 16, 라이브 텍스트 지원 단말, 라이브 텍스트 OFF
  - Target: LiveTextButton
  - Expected State: LiveTextButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 라이브 텍스트 인식 시 라이브 텍스트 버튼에 하이라이트가 적용된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 단일 말풍선 라이브 텍스트 버튼 선택
  - Preconditions: 로그인 계정, OS=iOS 16, 라이브 텍스트 지원 단말, 라이브 텍스트 OFF
  - Target: LiveTextButton
  - Expected State: LiveTextButton=Highlighted
  - Evidence: Screenshot
- **Check Point**: 라이브 텍스트 인식 상태에서 메시지 입력 시 커서가 노출되고 정상 수·발신된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 라이브 텍스트 인식 → 메시지 입력
  - Preconditions: 로그인 계정, OS=iOS 16, 라이브 텍스트 지원 단말
  - Target: MessageInput
  - Expected State: Cursor=Shown
  - Evidence: Screenshot, Video

### 라이브 텍스트 OFF - 이미지 말풍선

- **Check Point**: 라이브 텍스트 OFF 상태에서는 이미지 말풍선 우하단에 라이브 텍스트 버튼이 미노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 분석 가능 이미지 수·발신
  - Preconditions: 로그인 계정, OS=iOS 16, 라이브 텍스트 지원 단말, 라이브 텍스트 OFF
  - Target: LiveTextButton
  - Expected State: LiveTextButton=Hidden
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 라이브 텍스트 OFF 상태에서는 클린뷰/툴바뷰 전환 시에도 라이브 텍스트 버튼이 미노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 이미지 선택 → 클린뷰/툴바뷰 전환
  - Preconditions: 로그인 계정, OS=iOS 16, 라이브 텍스트 지원 단말, 라이브 텍스트 OFF
  - Target: LiveTextButton
  - Expected State: LiveTextButton=Hidden
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 라이브 텍스트 OFF 상태에서는 이미지 내 텍스트 드래그가 불가하다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 이미지 선택 → 텍스트 드래그
  - Preconditions: 로그인 계정, OS=iOS 16, 라이브 텍스트 지원 단말, 라이브 텍스트 OFF
  - Target: LiveText
  - Expected State: TextDrag=Disabled
  - Evidence: Video
- **Check Point**: 이미지 뷰어 롱프레스 시 [이 사진 전달하기][이 사진 저장하기] 메뉴가 제공된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 이미지 선택 → 이미지 뷰어 롱프레스
  - Preconditions: 로그인 계정, OS=iOS 16, 라이브 텍스트 지원 단말, 라이브 텍스트 OFF
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, OCR

### 라이브 텍스트 ON

- **Check Point**: 라이브 텍스트 ON 상태에서 텍스트 분석 가능 이미지 단일 말풍선 우하단에 라이브 텍스트 버튼이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 분석 가능 이미지 수·발신
  - Preconditions: 로그인 계정, OS=iOS 16, 라이브 텍스트 지원 단말, 라이브 텍스트 ON
  - Target: LiveTextButton
  - Expected State: LiveTextButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 라이브 텍스트 버튼 클릭 시 클린뷰(상세뷰)에서 라이브 텍스트 모드로 진입한다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 이미지 말풍선 라이브 텍스트 버튼 선택
  - Preconditions: 로그인 계정, OS=iOS 16, 라이브 텍스트 지원 단말, 라이브 텍스트 ON
  - Target: LiveText
  - Expected State: LiveTextMode=Entered
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 라이브 텍스트 모드 진입 시 라이브 텍스트 버튼에 파란색 하이라이트가 적용된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 라이브 텍스트 버튼 선택
  - Preconditions: 로그인 계정, OS=iOS 16, 라이브 텍스트 지원 단말, 라이브 텍스트 ON
  - Target: LiveTextButton
  - Expected State: LiveTextButton=BlueHighlighted
  - Evidence: Screenshot
- **Check Point**: 라이브 텍스트 모드에서 텍스트 분석(번역)이 정상 동작한다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 라이브 텍스트 모드 진입 → 텍스트 분석
  - Preconditions: 로그인 계정, OS=iOS 16, 라이브 텍스트 지원 단말, 라이브 텍스트 ON
  - Target: LiveText
  - Expected State: TextAnalysis=Success
  - Evidence: Screenshot, Video
- **Check Point**: 툴바 뷰 우하단 라이브 텍스트 버튼 선택 시 파란색 하이라이트가 적용되고 텍스트 분석이 정상 동작한다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 클린뷰→툴바뷰 전환 → 툴바뷰 라이브 텍스트 버튼 선택
  - Preconditions: 로그인 계정, OS=iOS 16, 라이브 텍스트 지원 단말, 라이브 텍스트 ON
  - Target: LiveTextButton
  - Expected State: LiveTextButton=BlueHighlighted
  - Evidence: Screenshot, Video

## 미디어 말풍선 송수신

### 사진 말풍선 송수신

- **Check Point**: 사진 말풍선이 정상 수·발신된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 사진 말풍선 송신 및 수신
  - Preconditions: 로그인 계정
  - Target: Bubble
  - Expected State: Photo=SentReceived
  - Evidence: Screenshot, APIResponse
- **Check Point**: 채팅탭 라스트 메시지에 "사진을 보냈습니다." 문구가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 라스트 메시지 확인
  - Preconditions: 로그인 계정, 사진 말풍선 송신 이력
  - Target: ChatList
  - Expected State: LastMessage="사진을 보냈습니다."
  - Evidence: Screenshot, OCR
- **Check Point**: 개별/묶음 설정에 따라 사진 말풍선이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 송·수신 사진 말풍선 확인
  - Preconditions: 로그인 계정
  - Target: Bubble
  - Expected State: PhotoBubble=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 사진 말풍선 클릭 시 사진 상세 화면으로 이동된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 사진 말풍선 탭
  - Preconditions: 로그인 계정
  - Target: Bubble
  - Expected State: PhotoDetail=Shown
  - Evidence: Screenshot

### 동영상 말풍선 송수신

- **Check Point**: 동영상 말풍선이 정상 수·발신된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 동영상 말풍선 송신 및 수신
  - Preconditions: 로그인 계정
  - Target: Bubble
  - Expected State: Video=SentReceived
  - Evidence: Screenshot, APIResponse
- **Check Point**: 채팅탭 라스트 메시지에 "동영상을 보냈습니다." 문구가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 라스트 메시지 확인
  - Preconditions: 로그인 계정, 동영상 말풍선 송신 이력
  - Target: ChatList
  - Expected State: LastMessage="동영상을 보냈습니다."
  - Evidence: Screenshot, OCR
- **Check Point**: 동영상 말풍선이 개별 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 송·수신 동영상 말풍선 확인
  - Preconditions: 로그인 계정
  - Target: Bubble
  - Expected State: VideoBubble=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 동영상 말풍선 클릭 시 동영상 상세 화면으로 이동된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 동영상 말풍선 탭
  - Preconditions: 로그인 계정
  - Target: Bubble
  - Expected State: VideoDetail=Shown
  - Evidence: Screenshot

## 톡뮤직 말풍선

### 단일곡 말풍선

- **Check Point**: 단일곡 말풍선에 앨범커버·재생 버튼·찜하기 버튼이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 단일곡 말풍선 확인
  - Preconditions: 로그인 계정, 단일곡 말풍선 존재
  - Target: Bubble
  - Expected State: SingleSongBubble=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 단일곡 말풍선에 곡명·아티스트명이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 단일곡 말풍선 확인
  - Preconditions: 로그인 계정, 단일곡 말풍선 존재
  - Target: Bubble
  - Expected State: SongInfo=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 재생 버튼 탭 시 해당 곡이 재생되며 미니플레이어가 실행된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 재생 버튼 탭
  - Preconditions: 로그인 계정, 단일곡 말풍선 존재
  - Target: MiniPlayer
  - Expected State: MiniPlayer=Playing
  - Evidence: Screenshot, Video
- **Check Point**: 단일곡 재생 시 재생목록이 전체 대치된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 재생 버튼 탭
  - Preconditions: 로그인 계정, 단일곡 말풍선 존재
  - Target: PlayList
  - Expected State: PlayList=Replaced
  - Evidence: APIResponse, Log
- **Check Point**: 찜하기 버튼 1회 탭 시 해당 곡이 찜목록에 추가된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 곡 찜하기 버튼 탭
  - Preconditions: 로그인 계정, 미찜 상태 곡
  - Target: LikeButton
  - Expected State: Song=Liked
  - Evidence: Screenshot, APIResponse
- **Check Point**: 이미 찜된 곡의 찜하기 버튼 탭 시 안내 스낵바가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 곡 찜하기 버튼 재탭
  - Preconditions: 로그인 계정, 이미 찜된 곡
  - Target: Snackbar
  - Expected State: Snackbar=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 찜 안내 스낵바 탭 시 찜목록 화면으로 이동된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 찜 안내 스낵바 탭
  - Preconditions: 로그인 계정
  - Target: Snackbar
  - Expected State: LikeList=Shown
  - Evidence: Screenshot
- **Check Point**: 곡명·아티스트명 탭 시 곡 상세화면으로 이동되며 가사탭이 포커싱된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 곡명/아티스트명 탭
  - Preconditions: 로그인 계정, 단일곡 말풍선 존재
  - Target: SongDetail
  - Expected State: SongDetail.Tab=Lyrics
  - Evidence: Screenshot

### 복수곡 말풍선

- **Check Point**: 복수곡 말풍선에 앨범커버·재생 버튼과 '이 노래 어때요?'·플레이리스트·N곡 정보가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 복수곡 말풍선 확인
  - Preconditions: 로그인 계정, 여러 곡을 선택하여 발송한 복수곡 말풍선 존재
  - Target: Bubble
  - Expected State: MultiSongBubble=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 재생 버튼 탭 시 재생목록 기존 곡이 모두 삭제되고 복수곡 전체가 추가되어 첫번째 곡부터 재생된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 재생 버튼 탭
  - Preconditions: 로그인 계정, 복수곡 말풍선 존재
  - Target: PlayList
  - Expected State: PlayList=Replaced
  - Evidence: APIResponse, Log
- **Check Point**: 복수곡 재생 시 미니플레이어가 실행된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 재생 버튼 탭
  - Preconditions: 로그인 계정, 복수곡 말풍선 존재
  - Target: MiniPlayer
  - Expected State: MiniPlayer=Playing
  - Evidence: Screenshot, Video
- **Check Point**: '이 노래 어때요?'·플레이리스트·N곡 영역 탭 시 복수곡 상세화면으로 이동된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 복수곡 텍스트 영역 탭
  - Preconditions: 로그인 계정, 복수곡 말풍선 존재
  - Target: Bubble
  - Expected State: MultiSongDetail=Shown
  - Evidence: Screenshot

### 플레이리스트 말풍선

- **Check Point**: 플레이리스트 말풍선에 앨범커버·재생 버튼과 플레이리스트명·N곡 정보가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 플레이리스트 말풍선 확인
  - Preconditions: 로그인 계정, 멜론 웹뷰에서 발송한 플레이리스트 말풍선 존재
  - Target: Bubble
  - Expected State: PlaylistBubble=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 재생 버튼 탭 시 재생목록 기존 곡이 모두 삭제되고 플레이리스트 전체가 추가되어 첫번째 곡부터 재생된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 재생 버튼 탭
  - Preconditions: 로그인 계정, 플레이리스트 말풍선 존재
  - Target: PlayList
  - Expected State: PlayList=Replaced
  - Evidence: APIResponse, Log
- **Check Point**: 플레이리스트명·N곡 영역 탭 시 플레이리스트 상세화면으로 이동된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 플레이리스트 텍스트 영역 탭
  - Preconditions: 로그인 계정, 플레이리스트 말풍선 존재
  - Target: Bubble
  - Expected State: PlaylistDetail=Shown
  - Evidence: Screenshot

### 앨범 말풍선

- **Check Point**: 앨범 말풍선에 앨범커버·재생 버튼과 앨범명·아티스트명·N곡 정보가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 앨범 말풍선 확인
  - Preconditions: 로그인 계정, 멜론 웹뷰에서 발송한 앨범 말풍선 존재
  - Target: Bubble
  - Expected State: AlbumBubble=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 재생 버튼 탭 시 재생목록 기존 곡이 모두 삭제되고 앨범 전체가 추가되어 첫번째 곡부터 재생된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 재생 버튼 탭
  - Preconditions: 로그인 계정, 앨범 말풍선 존재
  - Target: PlayList
  - Expected State: PlayList=Replaced
  - Evidence: APIResponse, Log
- **Check Point**: 앨범명·아티스트명·N곡 영역 탭 시 앨범 상세화면으로 이동되며 수록곡 탭이 포커싱된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 앨범 텍스트 영역 탭
  - Preconditions: 로그인 계정, 앨범 말풍선 존재
  - Target: AlbumDetail
  - Expected State: AlbumDetail.Tab=TrackList
  - Evidence: Screenshot

## 특수 말풍선 송수신

### 통화 말풍선

- **Check Point**: 발신한 통화가 말풍선으로 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 통화 발신
  - Preconditions: 로그인 계정
  - Target: Bubble
  - Expected State: CallBubble=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 수신한 통화가 말풍선으로 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 통화 수신
  - Preconditions: 로그인 계정
  - Target: Bubble
  - Expected State: CallBubble=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 통화 말풍선 탭 시 말풍선을 발생시킨 통화와 동일한 통화 타입으로 발신된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 통화 말풍선 탭
  - Preconditions: 로그인 계정, 통화 말풍선 존재
  - Target: Bubble
  - Expected State: Call=SameTypeDialed
  - Evidence: Screenshot, Log

### 일정 등록 완료 말풍선

- **Check Point**: 일정 등록 완료 말풍선에 '일정이 공유되었어요.'와 제목·시간이 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 그룹채팅방 진입 → 일정 등록 완료 말풍선 확인
  - Preconditions: 로그인 계정, 그룹채팅방, 일정 등록 완료
  - Target: Bubble
  - Expected State: ScheduleBubble=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: [일정보기] 선택 시 일정 상세로 이동된다.
  - Execution Path: 앱 실행 → 로그인 → 그룹채팅방 진입 → [일정보기] 탭
  - Preconditions: 로그인 계정, 그룹채팅방, 일정 말풍선 존재
  - Target: Bubble
  - Expected State: ScheduleDetail=Shown
  - Evidence: Screenshot

### 지도(위치) 말풍선

- **Check Point**: 위치 전송 시 지도·주소·[카카오맵][카카오T] 버튼을 포함한 지도 말풍선이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 지도 뷰 위치 전송
  - Preconditions: 로그인 계정, 위치서비스 ON
  - Target: Bubble
  - Expected State: MapBubble=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 지도 영역 선택 시 지도가 실행된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 지도 영역 선택
  - Preconditions: 로그인 계정, 지도 말풍선 존재
  - Target: Bubble
  - Expected State: Map=Launched
  - Evidence: Screenshot
- **Check Point**: [카카오맵] 선택 시 앱 설치 상태이면 카카오맵 앱으로 랜딩된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 지도 영역 선택 → [카카오맵] 선택
  - Preconditions: 로그인 계정, 지도 말풍선 존재, 카카오맵 앱 설치됨
  - Target: Bubble
  - Expected State: KakaoMap=AppLaunched
  - Evidence: Screenshot, Log
- **Check Point**: [카카오맵] 선택 시 앱 미설치 상태이면 스토어 앱 설치 화면으로 랜딩된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 지도 영역 선택 → [카카오맵] 선택
  - Preconditions: 로그인 계정, 지도 말풍선 존재, 카카오맵 앱 미설치
  - Target: Bubble
  - Expected State: KakaoMap=StoreLanding
  - Evidence: Screenshot, Log
- **Check Point**: [카카오T] 선택 시 앱 설치 상태이면 카카오T 앱으로 랜딩된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 지도 영역 선택 → [카카오 T] 선택
  - Preconditions: 로그인 계정, 지도 말풍선 존재, 카카오T 앱 설치됨
  - Target: Bubble
  - Expected State: KakaoT=AppLaunched
  - Evidence: Screenshot, Log
- **Check Point**: [카카오T] 선택 시 앱 미설치 상태이면 스토어 앱 설치 화면으로 랜딩된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 지도 영역 선택 → [카카오 T] 선택
  - Preconditions: 로그인 계정, 지도 말풍선 존재, 카카오T 앱 미설치
  - Target: Bubble
  - Expected State: KakaoT=StoreLanding
  - Evidence: Screenshot, Log

### 음성메시지 말풍선

- **Check Point**: 음성메시지 전송 시 재생 버튼과 재생시간이 표시된 음성메시지 말풍선이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 음성메시지 녹음 → 채팅방 공유
  - Preconditions: 로그인 계정, 마이크 권한 허용
  - Target: Bubble
  - Expected State: VoiceMessageBubble=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 음성메시지 말풍선 탭 시 음성메시지가 실행된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 음성메시지 말풍선 탭
  - Preconditions: 로그인 계정, 음성메시지 말풍선 존재
  - Target: Bubble
  - Expected State: VoiceMessage=Playing
  - Evidence: Screenshot, Video

### 카카오톡 프로필 말풍선

- **Check Point**: [카카오톡 프로필 보내기] 탭 시 나를 포함한 친구 피커가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 플러스메뉴 > 연락처 → [카카오톡 프로필 보내기] 탭
  - Preconditions: 로그인 계정
  - Target: FriendPicker
  - Expected State: FriendPicker=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 프로필 선택 후 [확인] 탭 시 선택한 프로필 말풍선(최대 10개)이 채팅방에 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 프로필 선택 → [확인] 탭
  - Preconditions: 로그인 계정, 내 프로필 포함 최대 10개 선택
  - Target: Bubble
  - Expected State: ProfileBubble=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 프로필 말풍선 내 [1:1채팅] 버튼 탭 시 해당 친구의 1:1채팅방으로 이동된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 프로필 말풍선 [1:1채팅] 탭
  - Preconditions: 로그인 계정, 프로필 말풍선 존재
  - Target: Bubble
  - Expected State: DirectChat=Shown
  - Evidence: Screenshot
- **Check Point**: 프로필 말풍선 내 [프로필 보기] 버튼 탭 시 해당 친구의 프로필이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 프로필 말풍선 [프로필 보기] 탭
  - Preconditions: 로그인 계정, 프로필 말풍선 존재
  - Target: ProfileView
  - Expected State: ProfileView=Shown
  - Evidence: Screenshot

### 연락처 보내기 말풍선

- **Check Point**: [연락처 보내기] 탭 시 주소록이 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 플러스메뉴 > 연락처 → [연락처 보내기] 탭
  - Preconditions: 로그인 계정, 연락처 접근 권한 허용
  - Target: AddressBook
  - Expected State: AddressBook=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 연락처 단일 선택 시 미리보기 UI가 표시되고 [전송] 탭 시 채팅방에 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 연락처 선택 → [전송] 탭
  - Preconditions: 로그인 계정, OS=Android, 단일 연락처 선택
  - Target: Bubble
  - Expected State: ContactBubble=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 연락처 단일 선택 시 선택한 연락처 말풍선이 발송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 연락처 선택
  - Preconditions: 로그인 계정, OS=iOS, 단일 연락처 선택
  - Target: Bubble
  - Expected State: ContactBubble=Sent
  - Evidence: Screenshot, APIResponse

### 파일 말풍선 송수신

- **Check Point**: 파일 선택 시 별도 안내 얼럿 없이 파일이 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 플러스메뉴 > 파일 → 임의 파일 선택
  - Preconditions: 로그인 계정, OS=Android
  - Target: Bubble
  - Expected State: File=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 파일 선택 시 파일 전송 얼럿이 노출되고 [전송] 탭 시 파일이 전송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 파일 앱 > 임의 파일 선택 → [전송] 탭
  - Preconditions: 로그인 계정, OS=iOS
  - Target: Alert
  - Expected State: File=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 전송된 파일 말풍선에 파일명·유효기간·용량 텍스트가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 파일 말풍선 확인
  - Preconditions: 로그인 계정, 파일 전송 이력
  - Target: Bubble
  - Expected State: FileInfo=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 친구가 아닌 사용자가 보낸 파일 다운로드 시도 시 '친구가 아닌 사용자가 보낸 파일은 안전하지 않을 수 있습니다. 다운로드하시겠습니까?' 얼럿이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 파일 말풍선 탭
  - Preconditions: 로그인 계정, 친구 아닌 사용자와의 1:1 채팅 또는 파일 수신 후 차단
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 친구가 아닌 사용자가 보낸 파일 전달 시도 시 '친구가 아닌 사용자가 보낸 파일은 안전하지 않을 수 있습니다. 공유하시겠습니까?' 얼럿이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 파일 말풍선 전달
  - Preconditions: 로그인 계정, 친구 아닌 사용자와의 1:1 채팅 또는 파일 수신 후 차단
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR

## 미디어·기본 말풍선 컨텍스트 메뉴

### 사진 말풍선 컨텍스트 메뉴

- **Check Point**: 사진 말풍선 롱탭 시 리액션·답장·공유·나에게·ChatGPT·공지·#검색·책갈피 설정·캡쳐·삭제 컨텍스트 메뉴가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 사진 말풍선 롱탭
  - Preconditions: 로그인 계정, 단일 사진 말풍선
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 친구가 아닌 사용자가 보낸 사진 말풍선 롱탭 시 컨텍스트 메뉴에 [신고]가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 사진 말풍선 롱탭
  - Preconditions: 로그인 계정, 친구가 아닌 사용자가 보낸 사진
  - Target: ContextMenu
  - Expected State: ReportMenu=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 묶음 사진 말풍선 롱탭 시 컨텍스트 메뉴에 공지·#검색이 미노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 묶음 사진 말풍선 롱탭
  - Preconditions: 로그인 계정, 묶음 사진 말풍선
  - Target: ContextMenu
  - Expected State: Notice,HashSearch=Hidden
  - Evidence: Screenshot, OCR
- **Check Point**: 말풍선 리액션 메뉴는 챗로그 위치에 따라 컨텍스트 메뉴 상단 또는 하단에 가변 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 사진 말풍선 롱탭
  - Preconditions: 로그인 계정, 단일 사진 말풍선
  - Target: ReactionBar
  - Expected State: ReactionBar.Position=Variable
  - Evidence: Screenshot

### 동영상 말풍선 컨텍스트 메뉴

- **Check Point**: 동영상 말풍선 롱탭 시 리액션·답장·공유·나에게·공지·책갈피 설정·캡쳐·삭제 컨텍스트 메뉴가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 동영상 말풍선 롱탭
  - Preconditions: 로그인 계정
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 친구가 아닌 사용자가 보낸 동영상 말풍선 롱탭 시 컨텍스트 메뉴에 [신고]가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 동영상 말풍선 롱탭
  - Preconditions: 로그인 계정, 친구가 아닌 사용자가 보낸 동영상
  - Target: ContextMenu
  - Expected State: ReportMenu=Shown
  - Evidence: Screenshot, OCR

### 통화 말풍선 컨텍스트 메뉴

- **Check Point**: 통화 말풍선 롱탭 시 리액션·답장·책갈피 설정·캡처·삭제 컨텍스트 메뉴가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 통화 말풍선 롱탭
  - Preconditions: 로그인 계정, 통화 말풍선 존재
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, OCR

### 음악 말풍선 컨텍스트 메뉴

- **Check Point**: 음악 말풍선 롱탭 시 삭제·답장·전달·책갈피 설정·캡처 컨텍스트 메뉴가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 음악 말풍선 롱탭
  - Preconditions: 로그인 계정, OS=Android, 음악 말풍선 존재
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 음악 말풍선 롱탭 시 답장·공유·책갈피 설정·캡처·삭제 컨텍스트 메뉴가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 음악 말풍선 롱탭
  - Preconditions: 로그인 계정, OS=iOS, 음악 말풍선 존재
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, OCR

### 일정 말풍선 컨텍스트 메뉴

- **Check Point**: 일정 등록 완료 말풍선 롱탭 시 말풍선 공감·답장·책갈피 설정·캡처·삭제 컨텍스트 메뉴가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 일정 말풍선 롱탭
  - Preconditions: 로그인 계정, OS=Android, 일정 말풍선 존재
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 일정 등록 완료 말풍선 롱탭 시 답장·책갈피 설정·캡처·삭제·말풍선 공감 컨텍스트 메뉴가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 일정 말풍선 롱탭
  - Preconditions: 로그인 계정, OS=iOS, 일정 말풍선 존재
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, OCR

### 지도 말풍선 컨텍스트 메뉴

- **Check Point**: 지도 말풍선 롱탭 시 리액션·복사·답장·공유·나에게·책갈피 설정·캡처·삭제 컨텍스트 메뉴가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 지도 말풍선 롱탭
  - Preconditions: 로그인 계정, 지도 말풍선 존재
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, OCR

## 첨부·특수 말풍선 컨텍스트 메뉴 및 파일 동작

### 음성메시지 말풍선 컨텍스트 메뉴

- **Check Point**: 음성메시지 말풍선 롱탭 시 리액션·내 파일에 저장·답장·공유·나에게·책갈피 설정·캡처·삭제 컨텍스트 메뉴가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 음성메시지 말풍선 롱탭
  - Preconditions: 로그인 계정, OS=Android, 음성메시지 말풍선 존재
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 음성메시지 말풍선 롱탭 시 복사·선택 복사·답장·공유·나에게·책갈피 설정·캡처·삭제·리액션 컨텍스트 메뉴가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 음성메시지 말풍선 롱탭
  - Preconditions: 로그인 계정, OS=iOS, 음성메시지 말풍선 존재
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, OCR

### 프로필·연락처 말풍선 컨텍스트 메뉴

- **Check Point**: 카카오톡 프로필 말풍선 롱탭 시 리액션·답장·공유·나에게·책갈피 설정·캡처·삭제 컨텍스트 메뉴가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 프로필 말풍선 롱탭
  - Preconditions: 로그인 계정, 프로필 말풍선 존재
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 연락처 보내기 말풍선 롱탭 시 답장·공유·나에게·책갈피 설정·캡처·삭제·리액션 컨텍스트 메뉴가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 연락처 말풍선 롱탭
  - Preconditions: 로그인 계정, 연락처 말풍선 존재
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, OCR

### 파일 말풍선 컨텍스트 메뉴

- **Check Point**: 파일 말풍선 롱탭 시 리액션(7일 이내)·내 파일에 저장·답장·공유·나에게·공지·책갈피 설정·캡처·삭제 컨텍스트 메뉴가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 파일 말풍선 롱탭
  - Preconditions: 로그인 계정, OS=Android, 파일 말풍선 존재
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 파일 말풍선 롱탭 시 답장·공유·나에게·공지·책갈피 설정·캡처·삭제·리액션(7일 이내) 컨텍스트 메뉴가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 파일 말풍선 롱탭
  - Preconditions: 로그인 계정, OS=iOS, 파일 말풍선 존재
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 차단한 상태의 파일 말풍선 롱탭 시 컨텍스트 메뉴에 [신고]가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 파일 말풍선 롱탭
  - Preconditions: 로그인 계정, 차단한 사용자의 파일 말풍선
  - Target: ContextMenu
  - Expected State: ReportMenu=Shown
  - Evidence: Screenshot, OCR

### 파일 다시 다운로드

- **Check Point**: 파일 말풍선 롱탭 > 다시 다운로드 시 별도 안내 얼럿 없이 파일이 재다운로드된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 파일 말풍선 롱탭 → 다시 다운로드
  - Preconditions: 로그인 계정, 파일 말풍선 존재
  - Target: File
  - Expected State: File=Redownloaded
  - Evidence: Screenshot, DB
- **Check Point**: 이미 동일 파일이 있는 경우 다시 다운로드 시 (파일명-n.확장자) 형태로 다운로드된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 파일 말풍선 롱탭 → 다시 다운로드
  - Preconditions: 로그인 계정, 동일 파일 기존 존재
  - Target: File
  - Expected State: FileName="파일명-n.확장자"
  - Evidence: DB, Log

### 파일 삭제

- **Check Point**: 발송 24시간 이내 파일 말풍선 롱탭 > 삭제 시 메시지 삭제 팝업이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 파일 말풍선 롱탭 → 삭제
  - Preconditions: 로그인 계정, 말풍선 발송 24시간 이내
  - Target: Alert
  - Expected State: DeletePopup=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 삭제 팝업에서 '모든 대화 상대에게서 삭제' 선택 후 [확인] 시 모든 대화 상대에게서 삭제된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 삭제 팝업 → 모든 대화 상대에게서 삭제 선택 → [확인] 탭
  - Preconditions: 로그인 계정, 말풍선 발송 24시간 이내
  - Target: Message
  - Expected State: Message=DeletedForAll
  - Evidence: Screenshot, APIResponse
- **Check Point**: 모든 대화 상대에게서 삭제 완료 시 삭제된 말풍선(피드 디자인)이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 삭제 완료
  - Preconditions: 로그인 계정
  - Target: Bubble
  - Expected State: DeletedBubble=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 발송 24시간 경과 후 파일 말풍선 롱탭 > 삭제 시 '나에게서만 삭제'가 바로 실행된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 파일 말풍선 롱탭 → 삭제
  - Preconditions: 로그인 계정, 말풍선 발송 24시간 경과
  - Target: Message
  - Expected State: DeleteMode=DeleteForMeOnly
  - Evidence: Screenshot
- **Check Point**: 나에게서만 삭제 실행 시 '현재 사용 중인 기기에서만 삭제됩니다.' 얼럿이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 삭제화면 → 대상 말풍선 선택 → 삭제하기
  - Preconditions: 로그인 계정, 말풍선 발송 24시간 경과
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR

### 파일 공지 등록

- **Check Point**: 파일 말풍선 롱탭 > 공지 시 '채팅방 상단 공지는 1건만 노출 가능합니다. 공지를 등록하시겠습니까?' 얼럿이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 파일 말풍선 롱탭 → 공지
  - Preconditions: 로그인 계정, 파일 말풍선 존재
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 공지 등록 얼럿에서 [예] 선택 시 "파일이 공지로 등록되었습니다." 텍스트로 공지 설정된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 공지 얼럿 → [예] 탭
  - Preconditions: 로그인 계정, 파일 말풍선 존재
  - Target: Notice
  - Expected State: Notice=Set
  - Evidence: Screenshot, OCR

## 챗로그 수정

### 수정 메뉴 노출 조건

- **Check Point**: 수정 제한 시간(24h) 이내 텍스트 포함 챗로그 롱탭 시 컨텍스트 메뉴에 수정 메뉴가 추가되어 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 챗로그 롱탭
  - Preconditions: 로그인 계정, 수정 지원 챗로그 타입(텍스트 포함), 발송 24시간 이내
  - Target: ContextMenu
  - Expected State: EditMenu=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 텍스트가 없는 챗로그(이모티콘만 발송 등) 롱탭 시 수정 메뉴가 미노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 챗로그 롱탭
  - Preconditions: 로그인 계정, 텍스트 미포함 챗로그, 발송 24시간 이내
  - Target: ContextMenu
  - Expected State: EditMenu=Hidden
  - Evidence: Screenshot, OCR
- **Check Point**: 수정 제한 시간(24h) 경과 후 챗로그 롱탭 시 수정 메뉴가 미노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 챗로그 롱탭
  - Preconditions: 로그인 계정, 발송 24시간 경과
  - Target: ContextMenu
  - Expected State: EditMenu=Hidden
  - Evidence: Screenshot, OCR

### 메시지 수정 동작

- **Check Point**: 수정 모드 진입 시 입력창이 레이어 형태의 수정 모드로 제공된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 챗로그 롱탭 → 수정
  - Preconditions: 로그인 계정, 수정 지원 챗로그(텍스트 포함)
  - Target: MessageInput
  - Expected State: EditMode=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 수정 모드에 내가 보낸 원본 메시지 텍스트가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 챗로그 롱탭 → 수정
  - Preconditions: 로그인 계정, 수정 지원 챗로그(텍스트 포함)
  - Target: MessageInput
  - Expected State: OriginalText=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 수정할 단어 입력 시 완료 [V] 버튼이 활성화되어 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 수정 모드 → 수정 단어 입력
  - Preconditions: 로그인 계정, 수정 지원 챗로그(텍스트 포함)
  - Target: SendButton
  - Expected State: SendButton=Enabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 일부 텍스트 수정 후 완료 [V] 탭 시 수정한 문구로 말풍선이 업데이트된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 수정 모드 → 텍스트 수정 → 완료 [V] 탭
  - Preconditions: 로그인 계정, 수정 지원 챗로그(텍스트 포함)
  - Target: Bubble
  - Expected State: Bubble=Updated
  - Evidence: Screenshot, APIResponse
- **Check Point**: 수정 완료된 말풍선 우측 하단에 '수정됨' 문구가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 수정 완료
  - Preconditions: 로그인 계정
  - Target: Bubble
  - Expected State: EditedLabel=Shown
  - Evidence: Screenshot, OCR

# 미디어 전송·다운로드

> 검증 그룹 10 · 항목 36 · 체크포인트 102

## 미디어 자동 다운로드

### 셀룰러망 다운로드 동작

- **Check Point**: 셀룰러망에서는 채팅방 목록에서 수신 미디어가 자동 다운로드되지 않는다.
  - Execution Path: 채팅방 진입 → 미디어 수신
  - Preconditions: 셀룰러(LTE/5G) 연결, 자동 다운로드 동작 조건은 Wi-Fi 전용
  - Target: MediaDownload
  - Expected State: AutoDownload=NotTriggered
  - Evidence: Screenshot, Log
- **Check Point**: 셀룰러망에서 5MB 이하 사진은 상세화면 진입 시 자동 다운로드된다.
  - Execution Path: 채팅방 진입 → 사진 말풍선 탭 → 상세화면 진입
  - Preconditions: 셀룰러(LTE/5G) 연결, 수신 사진 5MB 이하
  - Target: MediaViewer
  - Expected State: AutoDownload=Completed
  - Evidence: Screenshot, Log
- **Check Point**: 셀룰러망에서 5MB 초과 사진과 동영상은 상세화면에서도 자동 다운로드되지 않는다.
  - Execution Path: 채팅방 진입 → 미디어 말풍선 탭 → 상세화면 진입
  - Preconditions: 셀룰러(LTE/5G) 연결, 수신 사진 5MB 초과 또는 동영상
  - Target: MediaViewer
  - Expected State: AutoDownload=NotTriggered
  - Evidence: Screenshot, Log
- **Check Point**: 셀룰러망에서 대용량 사진·동영상·파일은 수동 다운로드 시 정상 저장된다.
  - Execution Path: 채팅방 진입 → 미디어 상세화면 진입 → 수동 다운로드 탭
  - Preconditions: 셀룰러(LTE/5G) 연결, 자동 다운로드 미진행 상태
  - Target: DownloadButton
  - Expected State: ManualDownload=Completed
  - Evidence: Screenshot, Log

### Wi-Fi 자동 다운로드 OFF 동작

- **Check Point**: 자동 다운로드 설정이 OFF면 채팅방 목록에서 미디어가 자동 다운로드되지 않는다.
  - Execution Path: 채팅방 진입 → 미디어 수신
  - Preconditions: Wi-Fi 연결, 미디어 자동 다운로드 설정 OFF
  - Target: MediaDownload
  - Expected State: AutoDownload=NotTriggered
  - Evidence: Screenshot, Log
- **Check Point**: 미디어 유형별 자동 다운로드가 OFF면 사진·동영상 상세화면에서도 자동 다운로드되지 않는다.
  - Execution Path: 채팅방 진입 → 미디어 상세화면 진입
  - Preconditions: Wi-Fi 연결, 자동 다운로드 ON, 사진·동영상·파일 개별 OFF
  - Target: MediaViewer
  - Expected State: AutoDownload=NotTriggered
  - Evidence: Screenshot, Log
- **Check Point**: 자동 다운로드 OFF 상태에서 미디어를 수동 다운로드하면 정상 저장된다.
  - Execution Path: 채팅방 진입 → 미디어 상세화면 진입 → 수동 다운로드 탭
  - Preconditions: Wi-Fi 연결, 미디어 자동 다운로드 설정 OFF
  - Target: DownloadButton
  - Expected State: ManualDownload=Completed
  - Evidence: Screenshot, Log

### Wi-Fi 자동 다운로드 ON - 용량 기준 동작

- **Check Point**: 자동 다운로드 기준 용량(20MB) 이하 사진은 채팅방 목록에서 자동 다운로드된다.
  - Execution Path: 채팅방 진입 → 사진 수신
  - Preconditions: Wi-Fi 연결, 사진 자동 다운로드 ON, 자동 다운로드 용량 20MB, 수신 사진 20MB 이하
  - Target: MediaDownload
  - Expected State: AutoDownload=Completed
  - Evidence: Screenshot, Log
- **Check Point**: 기준 용량 이하 동영상·파일은 채팅방 목록에서 자동 다운로드된다.
  - Execution Path: 채팅방 진입 → 미디어 수신
  - Preconditions: Wi-Fi 연결, 동영상·파일 자동 다운로드 ON, 수신 미디어 20MB 이하
  - Target: MediaDownload
  - Expected State: AutoDownload=Completed
  - Evidence: Screenshot, Log
- **Check Point**: 기준 용량(20MB) 초과 동영상·파일은 자동 다운로드되지 않는다.
  - Execution Path: 채팅방 진입 → 미디어 수신
  - Preconditions: Wi-Fi 연결, 자동 다운로드 ON, 수신 미디어 20MB 초과
  - Target: MediaDownload
  - Expected State: AutoDownload=NotTriggered
  - Evidence: Screenshot, Log
- **Check Point**: 20MB 초과 사진은 파일로 처리되어 자동 다운로드되지 않는다.
  - Execution Path: 채팅방 진입 → 사진 수신
  - Preconditions: Wi-Fi 연결, 자동 다운로드 용량 20MB, 수신 사진 20MB 초과
  - Target: MediaDownload
  - Expected State: MediaType=File, AutoDownload=NotTriggered
  - Evidence: Screenshot, Log
- **Check Point**: 자동 다운로드 기준 초과 미디어는 수동 다운로드 시 정상 저장된다.
  - Execution Path: 채팅방 진입 → 미디어 상세화면 진입 → 수동 다운로드 탭
  - Preconditions: Wi-Fi 연결, 자동 다운로드 기준 초과 미디어
  - Target: DownloadButton
  - Expected State: ManualDownload=Completed
  - Evidence: Screenshot, Log

### 음성메시지 다운로드

- **Check Point**: 음성메시지는 자동 다운로드 설정과 무관하게 자동 다운로드되지 않는다.
  - Execution Path: 채팅방 진입 → 음성메시지 수신
  - Preconditions: 음성메시지 수신, 자동 다운로드 설정값 영향 없음
  - Target: MediaDownload
  - Expected State: AutoDownload=NotTriggered
  - Evidence: Screenshot, Log
- **Check Point**: 음성메시지 재생 시도 시 수동 다운로드된다.
  - Execution Path: 채팅방 진입 → 음성메시지 재생 탭
  - Preconditions: 음성메시지 수신
  - Target: VoicePlayer
  - Expected State: ManualDownload=Completed
  - Evidence: Screenshot, Log

## 앨범 피커 (하프뷰·풀뷰)

### 하프뷰 진입 및 구성

- **Check Point**: 플러스메뉴 [사진] 버튼 탭 시 앨범 하프뷰가 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 탭 → [사진] 버튼 탭
  - Preconditions: 로그인 계정, 미디어 접근 권한 허용
  - Target: MediaPicker
  - Expected State: MediaPicker=HalfView
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 하프뷰 상단에 [X] 앨범 [전송] 형태의 앨범 내비게이션 바가 노출된다.
  - Execution Path: 앨범 하프뷰 진입
  - Preconditions: 미디어 접근 권한 허용
  - Target: PickerNavigationBar
  - Expected State: NavigationBar=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 사진 피커의 첫 번째 항목으로 카메라가 노출된다.
  - Execution Path: 앨범 하프뷰 진입
  - Preconditions: 카메라 권한 허용
  - Target: MediaPicker
  - Expected State: FirstItem=Camera
  - Evidence: Screenshot, ComponentTree

### 미디어 썸네일 표시

- **Check Point**: 앨범 피커에 사진·동영상 썸네일이 표시된다.
  - Execution Path: 앨범 하프뷰 진입
  - Preconditions: 디바이스 앨범에 사진·동영상 존재
  - Target: MediaThumbnail
  - Expected State: Thumbnail=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: GIF 썸네일 우측 하단에 GIF 표시가 노출된다.
  - Execution Path: 앨범 하프뷰 진입
  - Preconditions: 디바이스 앨범에 GIF 존재
  - Target: MediaThumbnail
  - Expected State: GifBadge=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 동영상 썸네일 우측 하단에 재생시간(m:ss)이 표시된다.
  - Execution Path: 앨범 하프뷰 진입
  - Preconditions: 디바이스 앨범에 동영상 존재
  - Target: MediaThumbnail
  - Expected State: DurationLabel=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 채팅방 내 전송 이력이 있는 미디어는 썸네일 상단에 노란 라인으로 표시된다.
  - Execution Path: 앨범 하프뷰 진입
  - Preconditions: 해당 채팅방에 미디어 전송 이력 존재
  - Target: MediaThumbnail
  - Expected State: SharedMediaMark=Shown
  - Evidence: Screenshot
- **Check Point**: 풀뷰 전환 시 폴더별 컨텐츠 개수가 표시된다.
  - Execution Path: 앨범 하프뷰 진입 → 핸들러 위로 드래그
  - Preconditions: OS=Android
  - Target: MediaPicker
  - Expected State: FolderItemCount=Shown
  - Evidence: Screenshot, OCR

### 미디어 선택 및 넘버링

- **Check Point**: 미디어 선택 시 선택 순서에 따라 넘버링이 표시된다.
  - Execution Path: 앨범 하프뷰 진입 → 미디어 다중 선택
  - Preconditions: 디바이스 앨범에 미디어 다수 존재
  - Target: MediaThumbnail
  - Expected State: SelectionNumber=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 미디어 선택 시 전송·편집 버튼이 활성화된다.
  - Execution Path: 앨범 하프뷰 진입 → 미디어 선택
  - Preconditions: 미디어 1개 이상 선택
  - Target: SendButton
  - Expected State: SendButton=Enabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 선택한 미디어 개수가 전송 버튼 앞에 표시된다.
  - Execution Path: 앨범 하프뷰 진입 → 미디어 다중 선택
  - Preconditions: 미디어 1개 이상 선택
  - Target: SendButton
  - Expected State: SelectedCount=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 121개 선택 시 "미디어 전송은 한번에 120개까지 가능합니다." 안내가 노출된다.
  - Execution Path: 앨범 하프뷰 진입 → 미디어 121개 선택 시도
  - Preconditions: 디바이스 앨범에 미디어 121개 이상 존재
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 풀뷰 상단에 선택한 미디어 썸네일 목록이 표시된다.
  - Execution Path: 앨범 풀뷰 진입 → 미디어 다중 선택
  - Preconditions: 미디어 1개 이상 선택, 풀뷰 전용 UI
  - Target: SelectedMediaStrip
  - Expected State: SelectedStrip=Shown
  - Evidence: Screenshot, ComponentTree

### 하프뷰·풀뷰 전환

- **Check Point**: 하프뷰에서 핸들러를 아래로 드래그해도 피커가 닫히지 않고 유지된다.
  - Execution Path: 앨범 하프뷰 진입 → 핸들러 아래로 드래그
  - Preconditions: -
  - Target: MediaPicker
  - Expected State: MediaPicker=HalfView
  - Evidence: Screenshot, Video
- **Check Point**: 하프뷰에서 핸들러를 위로 드래그하면 풀뷰로 확장된다.
  - Execution Path: 앨범 하프뷰 진입 → 핸들러 위로 드래그
  - Preconditions: -
  - Target: MediaPicker
  - Expected State: MediaPicker=FullView
  - Evidence: Screenshot, Video
- **Check Point**: 피커에서 [X] 버튼 탭 시 앨범 피커가 닫히고 키보드가 열린다.
  - Execution Path: 앨범 피커 진입 → [X] 버튼 탭
  - Preconditions: -
  - Target: MediaPicker
  - Expected State: MediaPicker=Closed, Keyboard=Opened
  - Evidence: Screenshot
- **Check Point**: 풀뷰에서 핸들러를 아래로 드래그하면 선택 항목을 유지한 채 하프뷰로 접힌다.
  - Execution Path: 앨범 풀뷰 진입 → 미디어 선택 → 핸들러 아래로 드래그
  - Preconditions: 미디어 1개 이상 선택
  - Target: MediaPicker
  - Expected State: MediaPicker=HalfView, Selection=Preserved
  - Evidence: Screenshot, Video

### 화질 설정 (더보기)

- **Check Point**: [더보기] 탭 시 화질 설정 메뉴가 컨텍스트 형태로 노출된다.
  - Execution Path: 앨범 피커 진입 → [더보기] 버튼 탭
  - Preconditions: -
  - Target: ContextMenu
  - Expected State: QualityMenu=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 설정한 화질이 미디어 전송 시 적용되고 전체 설정 미디어 전송 품질에도 반영된다.
  - Execution Path: 앨범 피커 진입 → [더보기] 탭 → 화질 설정 → 미디어 전송
  - Preconditions: -
  - Target: MediaMessage
  - Expected State: MediaQuality=Applied
  - Evidence: Screenshot, DB

## 미디어 편집

### 설명문구 입력

- **Check Point**: 편집기 상단에 설명문구 입력창이 플레이스홀더와 함께 노출된다.
  - Execution Path: 앨범 피커 진입 → 미디어 선택 → 편집기 진입
  - Preconditions: -
  - Target: CaptionInput
  - Expected State: CaptionInput=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 설명문구는 최대 50자까지 입력된다.
  - Execution Path: 편집기 진입 → 설명문구 입력창 탭 → 50자 초과 입력 시도
  - Preconditions: -
  - Target: CaptionInput
  - Expected State: MaxLength=50
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 설명문구 입력창에서는 줄바꿈이 입력되지 않는다.
  - Execution Path: 편집기 진입 → 설명문구 입력창 탭 → 줄바꿈 입력 시도
  - Preconditions: -
  - Target: CaptionInput
  - Expected State: LineBreak=Blocked
  - Evidence: Screenshot

### 사진 편집

- **Check Point**: 사진 선택 시 사진 편집기 화면으로 이동한다.
  - Execution Path: 앨범 피커 진입 → 사진 선택 → 편집기 실행
  - Preconditions: -
  - Target: PhotoEditor
  - Expected State: PhotoEditor=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 사진 편집기 하단에 필터·자르기/회전·텍스트·스티커·그리기 도구가 노출된다.
  - Execution Path: 사진 편집기 진입
  - Preconditions: -
  - Target: EditorToolbar
  - Expected State: Toolbar=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 편집한 사진을 전송하면 수신측에도 편집 내용이 반영되어 전달된다.
  - Execution Path: 사진 편집기 진입 → 편집 기능 사용 → [전송] 버튼 탭
  - Preconditions: -
  - Target: PhotoMessage
  - Expected State: EditedContent=Sent
  - Evidence: Screenshot, APIResponse

### 동영상 편집

- **Check Point**: 동영상 선택 시 동영상 편집기 화면으로 이동한다.
  - Execution Path: 앨범 피커 진입 → 동영상 선택 → 편집기 실행
  - Preconditions: -
  - Target: VideoEditor
  - Expected State: VideoEditor=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 동영상 편집기에 인코딩 예측 용량이 표시된다.
  - Execution Path: 동영상 편집기 진입
  - Preconditions: -
  - Target: VideoEditor
  - Expected State: EncodedSizeEstimate=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 편집한 동영상을 전송하면 수신측에도 편집 내용이 반영되어 전달된다.
  - Execution Path: 동영상 편집기 진입 → 편집 기능 사용 → [전송] 버튼 탭
  - Preconditions: -
  - Target: VideoMessage
  - Expected State: EditedContent=Sent
  - Evidence: Screenshot, APIResponse

### GIF/Webp 편집 미지원

- **Check Point**: GIF/Webp 미디어 선택 시 편집 기능이 노출되지 않는다.
  - Execution Path: 앨범 피커 진입 → GIF 선택 → 편집기 실행 시도
  - Preconditions: 편집 미지원 대상 미디어
  - Target: EditorToolbar
  - Expected State: EditFeature=NotShown
  - Evidence: Screenshot, ComponentTree

## 미디어 전송

### 사진 묶어보내기 OFF

- **Check Point**: 묶어보내기 OFF에서 사진 단일 전송 시 채팅방에 사진 말풍선이 전송된다.
  - Execution Path: 앨범 풀뷰 진입 → 사진 선택 → [전송] 탭
  - Preconditions: 사진 묶어보내기 OFF
  - Target: PhotoMessage
  - Expected State: MediaSent=Photo
  - Evidence: Screenshot, APIResponse
- **Check Point**: 묶어보내기 OFF에서 사진 다중 전송 시 개별 사진 말풍선으로 전송된다.
  - Execution Path: 앨범 풀뷰 진입 → 사진 다중 선택 → [전송] 탭
  - Preconditions: 사진 묶어보내기 OFF
  - Target: PhotoMessage
  - Expected State: MediaSent=IndividualBubbles
  - Evidence: Screenshot, APIResponse
- **Check Point**: 동영상 전송 시 인코딩(대기 > 압축 > 전송) 처리 후 개별 말풍선으로 전송된다.
  - Execution Path: 앨범 풀뷰 진입 → 동영상 선택 → [전송] 탭
  - Preconditions: -
  - Target: VideoMessage
  - Expected State: MediaSent=Video
  - Evidence: Screenshot, APIResponse, Log

### 사진 묶어보내기 ON

- **Check Point**: [사진 묶어보내기] 체크 시 최대 30장 안내 문구가 표시된다.
  - Execution Path: 앨범 풀뷰 진입 → [사진 묶어보내기] 체크
  - Preconditions: -
  - Target: Toast
  - Expected State: Notice=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 묶어보내기 ON에서 사진 다중 전송 시 선택 순서대로 묶음 말풍선으로 전송된다.
  - Execution Path: 앨범 풀뷰 진입 → 사진 다중 선택 → [전송] 탭
  - Preconditions: 사진 묶어보내기 ON
  - Target: PhotoMessage
  - Expected State: MediaSent=BundledBubble
  - Evidence: Screenshot, APIResponse
- **Check Point**: 묶어보내기 ON에서 사진·동영상 혼합 전송 시 사진은 묶음, 동영상은 개별 말풍선으로 전송된다.
  - Execution Path: 앨범 풀뷰 진입 → 사진·동영상 선택 → [전송] 탭
  - Preconditions: 사진 묶어보내기 ON
  - Target: MediaMessage
  - Expected State: PhotoBundled=True, VideoIndividual=True
  - Evidence: Screenshot, APIResponse

### 설명문구 포함 전송

- **Check Point**: 설명문구가 포함된 미디어는 말풍선에 설명 아이콘이 표시되고 상세화면에서 설명 문구가 노출된다.
  - Execution Path: 앨범 피커 진입 → 미디어 선택 → 설명문구 입력 → [전송] 탭
  - Preconditions: 설명문구 입력 완료
  - Target: MediaMessage
  - Expected State: CaptionIcon=Shown
  - Evidence: Screenshot, OCR

### LTE 안내 팝업

- **Check Point**: LTE 상태에서 총 용량 50MB 이상 미디어 전송 시 데이터 요금 안내 팝업이 노출된다.
  - Execution Path: 앨범 피커 진입 → 사진·동영상 선택 → [전송] 탭
  - Preconditions: LTE 연결, 선택 미디어 총 용량 50MB 이상
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: LTE 안내 팝업에서 [예/확인] 탭 시 미디어가 전송된다.
  - Execution Path: LTE 안내 팝업 노출 → [예/확인] 탭
  - Preconditions: LTE 연결, 선택 미디어 총 용량 50MB 이상
  - Target: MediaMessage
  - Expected State: MediaSent=True
  - Evidence: Screenshot, APIResponse

### 앨범에서 선택 (파일 메뉴)

- **Check Point**: 파일 > [앨범에서 선택] 진입 시 사진 묶어보내기·편집·화질 변경 메뉴가 없는 앨범 피커가 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 탭 → [파일] 탭 → [앨범에서 선택] 탭
  - Preconditions: 채팅방 종류: 팀/일반/나와의 채팅
  - Target: MediaPicker
  - Expected State: MediaPicker=Shown, EditMenu=NotShown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 앨범에서 선택 시 선택된 미디어 우측 상단에 체크 표시가 노출된다.
  - Execution Path: [앨범에서 선택] 진입 → 미디어 선택
  - Preconditions: -
  - Target: MediaThumbnail
  - Expected State: SelectionCheck=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 동영상 상세화면에 원본 용량과 재생 버튼이 표시된다.
  - Execution Path: [앨범에서 선택] 진입 → 동영상 상세화면 진입
  - Preconditions: -
  - Target: MediaViewer
  - Expected State: SizeLabel=Shown, PlayButton=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 앨범에서 선택한 파일이 채팅방으로 최대 120개까지 정상 전송된다.
  - Execution Path: [앨범에서 선택] 진입 → 미디어 선택 → [전송] 탭
  - Preconditions: 선택 미디어 최대 120개, 건당 최대 300MB
  - Target: MediaMessage
  - Expected State: MediaSent=True
  - Evidence: Screenshot, APIResponse

## 전송 용량 제한

### 사진 용량 초과

- **Check Point**: 원본 화질에서 20MB 이상 사진 전송 시 파일 말풍선으로 전송된다.
  - Execution Path: 앨범 피커 진입 → 20MB 이상 사진 선택 → [전송] 탭
  - Preconditions: 화질 원본 설정, 사진 개별 용량 20MB 이상
  - Target: FileMessage
  - Expected State: MediaType=File
  - Evidence: Screenshot, APIResponse
- **Check Point**: 묶어보내기 ON에서 20MB 이상 사진은 파일로, 나머지는 묶음 말풍선으로 분리 전송된다.
  - Execution Path: 앨범 피커 진입 → 20MB 미만+이상 사진 다중 선택 → [전송] 탭
  - Preconditions: 화질 원본 설정, 사진 묶어보내기 ON
  - Target: MediaMessage
  - Expected State: OverLimit=File, Others=Bundled
  - Evidence: Screenshot, APIResponse
- **Check Point**: 300MB 이상 사진 전송 시 전송 불가 안내가 노출된다.
  - Execution Path: 앨범 피커 진입 → 300MB 이상 사진 선택 → [전송] 탭
  - Preconditions: 화질 원본 설정, 사진 개별 용량 300MB 이상, 일반채팅방
  - Target: Alert
  - Expected State: SendBlocked=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 300MB 미만·이상 사진 혼합 선택 시 전송 가능한 파일만 전송 처리된다.
  - Execution Path: 앨범 피커 진입 → 300MB 미만+이상 사진 다중 선택 → [전송] 탭
  - Preconditions: 화질 원본 설정
  - Target: MediaMessage
  - Expected State: OnlySendable=Sent
  - Evidence: Screenshot, APIResponse

### 동영상 용량 초과

- **Check Point**: 고화질에서 300MB 이상 동영상 전송 시 전송 불가 안내가 노출된다.
  - Execution Path: 앨범 피커 진입 → 300MB 이상 동영상 선택 → [전송] 탭
  - Preconditions: 화질 고화질 설정, 동영상 개별 용량 300MB 이상
  - Target: Alert
  - Expected State: SendBlocked=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 300MB 미만·이상 동영상 혼합 선택 시 전송 가능한 파일만 전송 처리된다.
  - Execution Path: 앨범 피커 진입 → 300MB 미만+이상 동영상 다중 선택 → [전송] 탭
  - Preconditions: 화질 고화질 설정
  - Target: MediaMessage
  - Expected State: OnlySendable=Sent
  - Evidence: Screenshot, APIResponse

## 파일 전송 (파일 메뉴)

### 파일에서 선택

- **Check Point**: [파일에서 선택] 탭 시 디바이스 파일 저장소가 풀뷰로 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 탭 → [파일] 탭 → [파일에서 선택] 탭
  - Preconditions: 파일 접근 권한 허용
  - Target: FilePicker
  - Expected State: FilePicker=FullView
  - Evidence: Screenshot, ComponentTree
- **Check Point**: iOS에서 파일 앱이 열리며 설정된 클라우드 항목이 노출된다.
  - Execution Path: [파일에서 선택] 탭
  - Preconditions: OS=iOS, 클라우드 로그인 상태
  - Target: FilePicker
  - Expected State: CloudItems=Shown
  - Evidence: Screenshot
- **Check Point**: 선택한 파일이 채팅방으로 최대 120개까지 전송된다.
  - Execution Path: [파일에서 선택] 탭 → 파일 선택 → [선택]/[열기] 탭
  - Preconditions: 선택 파일 최대 120개
  - Target: FileMessage
  - Expected State: FileSent=True
  - Evidence: Screenshot, APIResponse

### 최근에 보낸 파일 목록

- **Check Point**: 파일 전송 후 [파일] 메뉴 재진입 시 최신 파일이 상단에 최근 목록으로 노출된다.
  - Execution Path: 파일 전송 완료 → 플러스메뉴 탭 → [파일] 메뉴 재진입
  - Preconditions: 최근 보낸 파일 30개 이내
  - Target: RecentFileList
  - Expected State: RecentFile=Added
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 최근에 보낸 파일이 30개일 때 신규 파일 추가 시 가장 오래된 파일이 목록에서 제외된다.
  - Execution Path: 파일 전송 완료 → [파일] 메뉴 재진입
  - Preconditions: 최근 보낸 파일 30개
  - Target: RecentFileList
  - Expected State: MaxCount=30
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 최근에 보낸 파일 항목 탭 시 목록 순서 갱신 없이 채팅방으로 전송된다.
  - Execution Path: [파일] 메뉴 진입 → 최근 파일 목록 탭
  - Preconditions: 최근 보낸 파일 목록 존재
  - Target: FileMessage
  - Expected State: FileSent=True, ListOrder=Unchanged
  - Evidence: Screenshot, APIResponse

### 최근에 보낸 파일 삭제

- **Check Point**: [전체삭제] 탭 시 삭제 확인 팝업이 노출된다.
  - Execution Path: [파일] 메뉴 진입 → [전체삭제] 버튼 탭
  - Preconditions: 최근 보낸 파일 목록 존재
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 전체삭제 팝업에서 [삭제] 탭 시 최근 목록이 모두 삭제되고 빈 화면이 노출된다.
  - Execution Path: [전체삭제] 탭 → 팝업 [삭제] 탭
  - Preconditions: 최근 보낸 파일 목록 존재
  - Target: RecentFileList
  - Expected State: RecentFile=Empty
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 롱탭(Android)/스와이프(iOS) 후 [삭제] 탭 시 해당 파일이 최근 목록에서 삭제된다.
  - Execution Path: [파일] 메뉴 진입 → 항목 롱탭/스와이프 → [삭제] 탭
  - Preconditions: 최근 보낸 파일 목록 존재
  - Target: RecentFileList
  - Expected State: SelectedFile=Removed
  - Evidence: Screenshot, ComponentTree

## 톡클라우드 파일 전송

### 진입 및 홈 이동

- **Check Point**: 톡클라우드 파일 전송하기 화면 상단 [홈] 버튼 탭 시 톡클라우드 홈으로 이동한다.
  - Execution Path: 톡클라우드 파일 전송하기 진입 → 상단 [홈] 버튼 탭
  - Preconditions: 톡클라우드 이용 계정
  - Target: TalkCloudHome
  - Expected State: Navigation=Home
  - Evidence: Screenshot

### 항목 타입별 전송

- **Check Point**: 사진/동영상 항목 전송 시 사진·동영상 타입 말풍선으로 전송된다.
  - Execution Path: 톡클라우드 파일 전송하기 진입 → 사진/동영상 항목 선택 → [전송] 탭
  - Preconditions: 톡클라우드 이용 계정
  - Target: MediaMessage
  - Expected State: MediaSent=Photo/Video
  - Evidence: Screenshot, APIResponse
- **Check Point**: 파일 항목 전송 시 파일 타입 말풍선으로 전송된다.
  - Execution Path: 톡클라우드 파일 전송하기 진입 → 파일 항목 선택 → [전송] 탭
  - Preconditions: 톡클라우드 이용 계정
  - Target: FileMessage
  - Expected State: MediaSent=File
  - Evidence: Screenshot, APIResponse
- **Check Point**: 링크 항목 전송 시 스크랩 말풍선으로 전송된다.
  - Execution Path: 톡클라우드 파일 전송하기 진입 → 링크 항목 선택 → [전송] 탭
  - Preconditions: 톡클라우드 이용 계정
  - Target: ScrapMessage
  - Expected State: MediaSent=Scrap
  - Evidence: Screenshot, APIResponse
- **Check Point**: 메모 항목 전송 시 텍스트 말풍선으로 전송된다.
  - Execution Path: 톡클라우드 파일 전송하기 진입 → 중요 진입 → 메모 항목 선택 → [전송] 탭
  - Preconditions: 톡클라우드 이용 계정
  - Target: TextMessage
  - Expected State: MediaSent=Text
  - Evidence: Screenshot, APIResponse

### 원본·대용량 파일 전송

- **Check Point**: 20MB 이하 사진·300MB 이하 동영상 선택 시 하단 원본 파일 보내기 옵션이 표시된다.
  - Execution Path: 톡클라우드 파일 전송하기 진입 → 드라이브 추가 미디어 선택
  - Preconditions: 드라이브에서 추가한 20MB 이하 사진 또는 300MB 이하 동영상
  - Target: OriginalFileOption
  - Expected State: OriginalOption=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 원본 파일 보내기 체크 후 전송 시 파일 타입으로 전송된다.
  - Execution Path: 미디어 선택 → 원본 파일 보내기 체크 → [전송] 탭
  - Preconditions: 원본 파일 보내기 옵션 노출
  - Target: FileMessage
  - Expected State: MediaType=File
  - Evidence: Screenshot, APIResponse
- **Check Point**: 300MB 이상 사진·동영상·파일 전송 시 대용량 파일 말풍선(레버리지 타입)으로 전송된다.
  - Execution Path: 톡클라우드 파일 전송하기 진입 → 300MB 이상 항목 선택 → [전송] 탭
  - Preconditions: 드라이브에서 추가한 300MB 이상 미디어
  - Target: LargeFileMessage
  - Expected State: MediaType=LargeFileLeverage
  - Evidence: Screenshot, APIResponse

## 대용량 파일 말풍선 관리

### 공유 관리 및 전체 목록

- **Check Point**: 미디어 상세에서 [공유 관리] 탭 시 공유 관리 화면으로 이동한다.
  - Execution Path: 대용량 파일 말풍선 탭 → 미디어 상세 진입 → [공유 관리] 탭
  - Preconditions: 대용량 파일 공유 계정
  - Target: ShareManagement
  - Expected State: Navigation=ShareManagement
  - Evidence: Screenshot
- **Check Point**: 미디어 상세에서 [전체 목록 보기] 탭 시 대용량 공유 파일 화면으로 이동한다.
  - Execution Path: 미디어 상세 진입 → [전체 목록 보기] 탭
  - Preconditions: 대용량 파일 공유 계정
  - Target: LargeFileList
  - Expected State: Navigation=LargeFileList
  - Evidence: Screenshot

### 저장하기

- **Check Point**: iOS에서 [저장하기] 탭 시 전체용량·받은용량과 [취소] 버튼이 있는 다운로드 UI가 표시된다.
  - Execution Path: 미디어 상세 진입 → [저장하기] 탭
  - Preconditions: OS=iOS, 대용량 파일 항목
  - Target: DownloadProgress
  - Expected State: DownloadUI=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: iOS에서 다중 항목 저장 시 다운로드 UI에 현재 다운 중인 파일 개수가 표시된다.
  - Execution Path: 다중 미디어 선택 → [저장하기] 탭
  - Preconditions: OS=iOS, 대용량 파일 다중 항목
  - Target: DownloadProgress
  - Expected State: FileCount=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: Android에서 [저장하기] 탭 시 시작·완료 토스트 메시지가 표시된다.
  - Execution Path: 개별 옵션 메뉴 진입 → [저장하기] 탭
  - Preconditions: OS=Android, 대용량 파일 항목
  - Target: Toast
  - Expected State: Toast=Shown
  - Evidence: Screenshot, OCR

### 백그라운드 저장 및 이어받기

- **Check Point**: 다운로드 중 빈 화면 탭 시 백그라운드 저장 안내 얼럿이 표시된다.
  - Execution Path: 다운로드 진행 중 → 빈 화면 탭
  - Preconditions: OS=iOS, 다운로드 중
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 안내 얼럿에서 [계속 진행하기] 탭 후 다운로드 완료 시 상단 띠배너가 표시된다.
  - Execution Path: 백그라운드 저장 얼럿 노출 → [계속 진행하기] 탭 → 다운로드 완료
  - Preconditions: OS=iOS, 다운로드 중
  - Target: Banner
  - Expected State: CompletionBanner=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 이전 다운로드 중단 항목이 있는 파일 저장 시 이어받기 얼럿이 표시된다.
  - Execution Path: 파일 상세 진입 → [저장하기] 탭
  - Preconditions: OS=iOS, 다운로드 중 중단한 항목 존재
  - Target: Alert
  - Expected State: ResumeAlert=Shown
  - Evidence: Screenshot, OCR

### 전달 및 삭제

- **Check Point**: 대용량 파일 전달 시 선택한 채팅방에 대용량 파일 말풍선이 발신된다.
  - Execution Path: 미디어 상세 진입 → 전달하기 → 채팅방 선택
  - Preconditions: 대용량 파일 공유 계정
  - Target: LargeFileMessage
  - Expected State: Forwarded=True
  - Evidence: Screenshot, APIResponse
- **Check Point**: 대용량 파일 전달 시 전달받은 채팅방 멤버가 파일 권한 사용자에 추가된다.
  - Execution Path: 전달하기 → 채팅방 선택 → 전달 완료
  - Preconditions: 대용량 파일 공유 계정
  - Target: SharePermission
  - Expected State: PermissionMember=Added
  - Evidence: APIResponse, DB
- **Check Point**: 삭제하기 후 [삭제] 탭 시 파일이 대용량 공유 파일 목록에서 제거된다.
  - Execution Path: 미디어 상세 진입 → 삭제하기 탭 → [삭제] 탭
  - Preconditions: 대용량 파일 공유 계정
  - Target: LargeFileList
  - Expected State: File=Removed
  - Evidence: Screenshot, DB

### 상세정보

- **Check Point**: 더보기 > 상세정보에서 종류·크기(사진/동영상은 해상도 포함) 정보가 표시된다.
  - Execution Path: 미디어 상세 진입 → 더보기 탭 → 상세정보 확인
  - Preconditions: 대용량 파일 항목
  - Target: FileDetailInfo
  - Expected State: DetailInfo=Shown
  - Evidence: Screenshot, OCR

## 미디어 캡처 저장·전달

### 캡처 저장

- **Check Point**: 캡처 영역 선택 후 [저장] 탭 시 선택 모드가 해제되고 채팅방으로 돌아간다.
  - Execution Path: 캡처 영역 진입 → 챗로그 선택 → [저장] 버튼 탭
  - Preconditions: -
  - Target: CaptureMode
  - Expected State: CaptureMode=Closed
  - Evidence: Screenshot
- **Check Point**: 캡처 [저장] 시 선택한 영역이 디바이스 앨범에 사진으로 저장된다.
  - Execution Path: 캡처 영역 진입 → 챗로그 선택 → [저장] 버튼 탭
  - Preconditions: 저장소 접근 권한 허용
  - Target: DeviceAlbum
  - Expected State: CaptureSaved=True
  - Evidence: Screenshot, DB

### 캡처 전달

- **Check Point**: 캡처 영역 선택 후 [전달] 탭 시 선택 모드가 해제되고 채팅방으로 돌아간다.
  - Execution Path: 캡처 영역 진입 → 챗로그 선택 → [전달] 버튼 탭
  - Preconditions: -
  - Target: CaptureMode
  - Expected State: CaptureMode=Closed
  - Evidence: Screenshot
- **Check Point**: 캡처 [전달] 후 대상 선택 시 선택한 친구/채팅방에 캡처 사진이 전송된다.
  - Execution Path: 캡처 [전달] 탭 → 전달 대상 선택 → 전달 완료
  - Preconditions: -
  - Target: PhotoMessage
  - Expected State: CaptureSent=True
  - Evidence: Screenshot, APIResponse

## 백그라운드 업로드 (다이내믹 아일랜드)

### 컴팩트 뷰

- **Check Point**: 단일 파일 업로드 중 앱 백그라운드 전환 시 잠금화면에 Compact View가 노출된다.
  - Execution Path: 단일 파일(300MB 이하) 업로드 중 → 앱 백그라운드 전환
  - Preconditions: 다이내믹 아일랜드 지원 단말
  - Target: DynamicIsland
  - Expected State: DynamicIsland=CompactView
  - Evidence: Screenshot
- **Check Point**: Compact View에는 '전송 중' 텍스트가 표시되지 않는다.
  - Execution Path: 단일 파일 업로드 중 → 앱 백그라운드 전환 → Compact View 확인
  - Preconditions: 다이내믹 아일랜드 지원 단말
  - Target: DynamicIsland
  - Expected State: SubText=NotShown
  - Evidence: Screenshot, OCR

### 익스펜디드 뷰

- **Check Point**: 다이내믹 아일랜드 영역을 1~2초 터치하면 Expanded View로 전환된다.
  - Execution Path: 단일 파일 업로드 중 → 앱 백그라운드 전환 → 다이내믹 아일랜드 롱터치
  - Preconditions: 다이내믹 아일랜드 지원 단말
  - Target: DynamicIsland
  - Expected State: DynamicIsland=ExpandedView
  - Evidence: Screenshot
- **Check Point**: Expanded View에 '전송 중' 텍스트가 표시된다.
  - Execution Path: Expanded View 전환
  - Preconditions: 다이내믹 아일랜드 지원 단말
  - Target: DynamicIsland
  - Expected State: SubText=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: Expanded View에 채팅방 이름이 글자수 제한 없이 표시된다.
  - Execution Path: Expanded View 전환
  - Preconditions: 다이내믹 아일랜드 지원 단말
  - Target: DynamicIsland
  - Expected State: ChatRoomName=Shown
  - Evidence: Screenshot, OCR

### 미니멀 뷰

- **Check Point**: 백그라운드 활동이 2개 이상일 때 다이내믹 아일랜드가 Minimal Mode로 표시된다.
  - Execution Path: 단일 파일 업로드 중 → 백그라운드 활동 2개 이상
  - Preconditions: 다이내믹 아일랜드 지원 단말, 백그라운드 활동 2개 이상
  - Target: DynamicIsland
  - Expected State: DynamicIsland=MinimalMode
  - Evidence: Screenshot
- **Check Point**: Minimal Mode에서 앱 아이콘 없이 프로그레스 인디케이터만 2개로 분리 노출된다.
  - Execution Path: 백그라운드 활동 2개 이상 → Minimal View 확인
  - Preconditions: 다이내믹 아일랜드 지원 단말, 백그라운드 활동 2개 이상
  - Target: DynamicIsland
  - Expected State: AppIcon=NotShown, ProgressIndicator=Split
  - Evidence: Screenshot

# 소식·게시물·일정

> 검증 그룹 8 · 항목 29 · 체크포인트 89

## 축하선물 이벤트(링키파이)

### 축하배너 노출

- **Check Point**: 트리거텍스트가 포함된 텍스트 전송 시 채팅방 상단에 축하배너가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 트리거텍스트 포함 텍스트 입력 → 전송
  - Preconditions: 상시운영 이벤트 활성(생일/결혼/일반), 트리거텍스트 30자 이내, 보낸사람 시점
  - Target: CelebrationBanner
  - Expected State: CelebrationBanner.Top=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 트리거텍스트가 포함된 텍스트 전송 시 채팅방 하단에 축하배너가 노출된다.
  - Execution Path: 채팅방 진입 → 트리거텍스트 포함 텍스트 입력 → 전송
  - Preconditions: 상시운영 이벤트 활성, 받는사람 시점
  - Target: CelebrationBanner
  - Expected State: CelebrationBanner.Bottom=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 어드민에 정의된 시간이 경과하면 축하배너가 자동으로 숨겨진다.
  - Execution Path: 축하배너 노출 → 정의된 시간 경과 대기
  - Preconditions: 축하배너 노출 상태, 어드민 정의 노출 시간
  - Target: CelebrationBanner
  - Expected State: CelebrationBanner=Hidden
  - Evidence: Screenshot, Log
- **Check Point**: 채팅방 재진입 시 노출조건에 해당하면 축하배너가 재노출된다.
  - Execution Path: 채팅방 이탈 → 채팅방 재진입
  - Preconditions: 배너 노출조건 충족
  - Target: CelebrationBanner
  - Expected State: CelebrationBanner=Shown
  - Evidence: Screenshot

### 트리거말풍선 발화

- **Check Point**: 트리거말풍선 누적 갯수 설정에 맞춰 상단배너가 노출된다.
  - Execution Path: 채팅방 진입 → 트리거말풍선 누적
  - Preconditions: 트리거말풍선 누적 갯수 설정값
  - Target: CelebrationBanner
  - Expected State: CelebrationBanner.Top=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 트리거말풍선 누적 갯수 설정에 맞춰 하단배너가 노출된다.
  - Execution Path: 채팅방 진입 → 트리거말풍선 누적
  - Preconditions: 트리거말풍선 누적 갯수 설정값
  - Target: CelebrationBanner
  - Expected State: CelebrationBanner.Bottom=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 축하하기 배너 선택 시 선물하기 바텀시트가 노출된다.
  - Execution Path: 축하배너 노출 → 축하하기 배너 탭
  - Preconditions: 축하배너 노출 상태
  - Target: BottomSheet
  - Expected State: GiftBottomSheet=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 바텀시트 우측 상단 폭죽쏘기 탭 시 폭죽 애니메이션이 발화된다.
  - Execution Path: 선물하기 바텀시트 노출 → 우측 상단 폭죽쏘기 탭
  - Preconditions: 선물하기 바텀시트 노출 상태
  - Target: Animation
  - Expected State: FireworksAnimation=Played
  - Evidence: Video, Screenshot
- **Check Point**: 폭죽쏘기 실행 시 채팅방에 어태치말풍선이 발송된다.
  - Execution Path: 폭죽쏘기 탭
  - Preconditions: 선물하기 바텀시트 노출 상태
  - Target: Bubble
  - Expected State: AttachBubble=Sent
  - Evidence: Screenshot, APIResponse

### 선물하기 미니 연동

- **Check Point**: 선물하기 배너 탭 시 선물하기 미니 바텀시트가 열린다.
  - Execution Path: 축하배너 노출 → 선물하기 배너 탭
  - Preconditions: 축하배너 노출 상태
  - Target: BottomSheet
  - Expected State: GiftMiniBottomSheet=Opened
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 생일자가 1명인 경우 선물하기 미니로 즉시 이동되며 생일자 타겟이 고정된다.
  - Execution Path: 선물하기 배너 탭
  - Preconditions: 생일자 1명
  - Target: GiftMini
  - Expected State: GiftMini=Landed
  - Evidence: Screenshot, APIResponse
- **Check Point**: 생일자가 0명 또는 복수명인 경우 친구피커로 이동된다.
  - Execution Path: 선물하기 배너 탭
  - Preconditions: 생일자 0명 또는 복수명
  - Target: FriendPicker
  - Expected State: FriendPicker=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 친구피커에서 친구 선택 시 선물하기 미니로 이동된다.
  - Execution Path: 친구피커 진입 → 친구 선택
  - Preconditions: 친구피커 노출 상태
  - Target: GiftMini
  - Expected State: GiftMini=Landed
  - Evidence: Screenshot

### 선물완료 자랑하기

- **Check Point**: 선물완료 후 '이 채팅방에 자랑하기' 실행 시 해당 채팅방에 선물완료 피드가 발송된다.
  - Execution Path: 선물완료 → '이 채팅방에 자랑하기' 실행
  - Preconditions: 결제용 쇼핑포인트 세팅, 선물 결제 완료 상태
  - Target: Bubble
  - Expected State: GiftCompleteFeed=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: '이 채팅방에 자랑하기' 실행 시 해당 채팅방에 선물완료 애니메이션이 발화된다.
  - Execution Path: 선물완료 → '이 채팅방에 자랑하기' 실행
  - Preconditions: 선물 결제 완료 상태
  - Target: Animation
  - Expected State: GiftCompleteAnimation=Played
  - Evidence: Video, Screenshot
- **Check Point**: 선물수신자와의 1:1방에 선물완료 레버리지 말풍선이 발송된다.
  - Execution Path: 선물완료 → '이 채팅방에 자랑하기' 실행
  - Preconditions: 선물수신자와 1:1 채팅방 존재
  - Target: Bubble
  - Expected State: GiftLeverageBubble=Sent
  - Evidence: Screenshot, APIResponse

## 공지 영역

### 공지 배너 UI

- **Check Point**: 채팅방 상단에 확성기 아이콘·공지 내용·X가 포함된 공지 배너가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입
  - Preconditions: 등록된 공지 존재
  - Target: NoticeBanner
  - Expected State: NoticeBanner=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 새 공지가 있는 경우 좌측 상단에 빨간점이 노출된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 미확인 새 공지 존재
  - Target: NoticeBanner
  - Expected State: NewNoticeDot=Shown
  - Evidence: Screenshot
- **Check Point**: 공지 내용이 2줄을 초과하면 최대 2줄까지 노출 후 말줄임 처리된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 공지 내용 2줄 초과
  - Target: NoticeBanner
  - Expected State: NoticeText=Ellipsized(MaxLines=2)
  - Evidence: Screenshot, OCR

### 공지 배너 인터랙션

- **Check Point**: 공지 배너 X 버튼 탭 시 공지 배너가 사라진다.
  - Execution Path: 채팅방 진입 → 공지 배너 X 버튼 탭
  - Preconditions: 공지 배너 노출 상태
  - Target: NoticeBanner
  - Expected State: NoticeBanner=Hidden
  - Evidence: Screenshot
- **Check Point**: 공지 배너 탭 시 공지로 등록된 게시글로 이동된다.
  - Execution Path: 채팅방 진입 → 공지 배너 탭
  - Preconditions: 공지 배너 노출 상태
  - Target: Post
  - Expected State: NoticePostDetail=Landed
  - Evidence: Screenshot

## 친구위치 그룹(카카오맵 연동)

### 그룹 생성 진입

- **Check Point**: 플러스메뉴에서 [친구위치] 선택 시 스태틱맵 바텀시트가 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 아이콘 탭 → [친구위치] 메뉴 선택
  - Preconditions: 채팅방에 연결된 위치 그룹 없음
  - Target: BottomSheet
  - Expected State: StaticMapBottomSheet=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: [동의 후 카카오맵에서 시작] 선택 시 카카오맵이 실행되며 그룹에 입장된다.
  - Execution Path: 스태틱맵 바텀시트 노출 → [동의 후 카카오맵에서 시작] 탭
  - Preconditions: 카카오맵 설치 및 로그인, 카카오맵 권한 모두 허용, 동의 시 톡 유저 ID·chatID 맵서버 전달
  - Target: KakaoMap
  - Expected State: LocationGroup=Entered
  - Evidence: Screenshot, APIResponse
- **Check Point**: 그룹 입장 시 친구위치 그룹 이름 설정 바텀시트와 키패드 영역이 노출된다.
  - Execution Path: 카카오맵 실행 및 그룹 입장
  - Preconditions: 카카오맵 그룹 입장 상태
  - Target: BottomSheet
  - Expected State: GroupNameBottomSheet=Shown
  - Evidence: Screenshot, ComponentTree

### 그룹 생성 완료 및 초대

- **Check Point**: 그룹 이름 설정 후 [저장하고 초대 메시지 보내기] 시 초대 완료 팝업이 노출된다.
  - Execution Path: 그룹 입장 → 그룹 이름 입력 → [저장하고 초대 메시지 보내기] 탭
  - Preconditions: 카카오맵 그룹 입장 상태
  - Target: Popup
  - Expected State: InviteCompletePopup=Shown
  - Evidence: Screenshot
- **Check Point**: 초대 완료 팝업 [닫기] 시 팝업이 종료되며 지도뷰가 노출된다.
  - Execution Path: 초대 완료 팝업 노출 → [닫기] 탭
  - Preconditions: 초대 완료 팝업 노출 상태
  - Target: KakaoMap
  - Expected State: MapView=Shown
  - Evidence: Screenshot
- **Check Point**: 초대 완료 팝업 [카카오톡 열기] 시 톡 채팅방으로 이동되며 [친구위치 바로가기] 초대메시지가 노출된다.
  - Execution Path: 초대 완료 팝업 노출 → [카카오톡 열기] 탭
  - Preconditions: 초대 완료 팝업 노출 상태
  - Target: Bubble
  - Expected State: InviteMessage=Shown
  - Evidence: Screenshot

### 그룹 참여

- **Check Point**: 연결된 위치 그룹이 있을 때 [동의 후 카카오맵에서 시작] 시 카카오톡으로 그룹 초대 메시지가 발송된다.
  - Execution Path: 플러스메뉴 아이콘 탭 → [친구위치] 메뉴 선택 → [동의 후 카카오맵에서 시작] 탭
  - Preconditions: 카카오맵 설치 및 로그인, 카카오맵 권한 모두 허용, 채팅방에 연결된 위치 그룹 있음
  - Target: Bubble
  - Expected State: GroupInviteMessage=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: [카카오톡 열기] 선택 시 톡 채팅방으로 이동되며 [초대 수락하기] 초대메시지가 노출된다.
  - Execution Path: 초대 메시지 발송 → [카카오톡 열기] 탭
  - Preconditions: 그룹 초대 메시지 발송 상태
  - Target: Bubble
  - Expected State: InviteMessage=Shown
  - Evidence: Screenshot
- **Check Point**: 초대메시지 [나도 참여하기] 선택 시 채팅방 뷰로 랜딩되며 현재 내 위치 POI가 노출된다.
  - Execution Path: 초대메시지 노출 → [나도 참여하기] 선택
  - Preconditions: 초대메시지 노출 상태, 위치 권한 허용
  - Target: KakaoMap
  - Expected State: MyLocationPOI=Shown
  - Evidence: Screenshot

## 톡캘린더 일정 영역

### 일정 없음

- **Check Point**: 다가올 일정이 없을 때 일정 영역 선택 시 톡캘린더 목록으로 이동된다.
  - Execution Path: 채팅방 진입 → 톡캘린더 일정 영역 탭
  - Preconditions: 다가올 일정 없음
  - Target: TalkCalendar
  - Expected State: CalendarList=Landed
  - Evidence: Screenshot

### 일정 바 UI

- **Check Point**: 다가올 일정이 있을 때 일정 바에 제목·시작시간·장소·날짜가 표시된다.
  - Execution Path: 채팅방 진입 → 일정 영역 확인
  - Preconditions: 다가올 일정 1개 이상
  - Target: ScheduleBar
  - Expected State: ScheduleBar=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 참여 상태 일정의 일정 바는 채워진 컬러바로 표시된다.
  - Execution Path: 채팅방 진입 → 일정 영역 확인
  - Preconditions: 일정 참여 상태
  - Target: ScheduleBar
  - Expected State: ColorBar=Filled
  - Evidence: Screenshot
- **Check Point**: 불참 상태 일정의 일정 바는 빈 컬러바와 일정 취소선으로 표시된다.
  - Execution Path: 채팅방 진입 → 일정 영역 확인
  - Preconditions: 일정 불참 상태
  - Target: ScheduleBar
  - Expected State: ColorBar=Empty(Strikethrough)
  - Evidence: Screenshot
- **Check Point**: 미정 상태 일정의 일정 바는 빗금 컬러바로 표시된다.
  - Execution Path: 채팅방 진입 → 일정 영역 확인
  - Preconditions: 일정 미정 상태
  - Target: ScheduleBar
  - Expected State: ColorBar=Hatched
  - Evidence: Screenshot
- **Check Point**: 오늘 날짜의 일정은 날짜 하단에 '오늘'이 표시된다.
  - Execution Path: 채팅방 진입 → 일정 영역 확인
  - Preconditions: 오늘 날짜 일정 존재
  - Target: ScheduleBar
  - Expected State: TodayLabel=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 일정 선택 시 일정 상세로 이동된다.
  - Execution Path: 채팅방 진입 → 일정 바 선택
  - Preconditions: 다가올 일정 1개 이상
  - Target: ScheduleDetail
  - Expected State: ScheduleDetail=Landed
  - Evidence: Screenshot

### 복수 일정 노출 규칙

- **Check Point**: 다가올 일정은 최대 2개까지만 노출된다.
  - Execution Path: 채팅방 진입 → 일정 영역 확인
  - Preconditions: 다가올 일정 2개 이상
  - Target: ScheduleBar
  - Expected State: ScheduleBar.Count=Max2
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 동일 날짜의 일정인 경우 날짜는 한번만 표시된다.
  - Execution Path: 채팅방 진입 → 일정 영역 확인
  - Preconditions: 동일 날짜 일정 2개 이상
  - Target: ScheduleBar
  - Expected State: DateLabel=ShownOnce
  - Evidence: Screenshot

## 톡게시판 진입·글쓰기

### 톡게시판 진입

- **Check Point**: 사이드메뉴에서 게시판 영역 탭 시 톡게시판이 [전체] 탭으로 열린다.
  - Execution Path: 채팅방 진입 → 사이드메뉴 진입 → 게시판 영역 탭
  - Preconditions: -
  - Target: TalkBoard
  - Expected State: TalkBoard.Tab=All
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 사이드메뉴에서 [공지] 또는 [투표] 버튼 탭 시 톡게시판이 해당 탭으로 열린다.
  - Execution Path: 채팅방 진입 → 사이드메뉴 진입 → [공지] 또는 [투표] 버튼 탭
  - Preconditions: -
  - Target: TalkBoard
  - Expected State: TalkBoard.Tab=Selected
  - Evidence: Screenshot, ComponentTree

### 탭 타입별 글쓰기 랜딩

- **Check Point**: [전체]·[사진]·[동영상]·[파일] 탭에서 글쓰기 진입 시 default type 글쓰기 화면으로 이동된다.
  - Execution Path: 톡게시판 진입 → [전체/사진/동영상/파일] 탭 선택 → 글쓰기 진입
  - Preconditions: -
  - Target: PostEditor
  - Expected State: PostEditor.Type=Default
  - Evidence: Screenshot, ComponentTree
- **Check Point**: [공지] 탭에서 글쓰기 진입 시 공지 옵션이 체크된 글쓰기 화면으로 이동된다.
  - Execution Path: 톡게시판 진입 → [공지] 탭 선택 → 글쓰기 진입
  - Preconditions: -
  - Target: PostEditor
  - Expected State: NoticeOption=Checked
  - Evidence: Screenshot, ComponentTree
- **Check Point**: [투표] 탭에서 글쓰기 진입 시 투표 템플릿이 추가된 글쓰기 화면으로 이동된다.
  - Execution Path: 톡게시판 진입 → [투표] 탭 선택 → 글쓰기 진입
  - Preconditions: -
  - Target: PostEditor
  - Expected State: PollTemplate=Added
  - Evidence: Screenshot, ComponentTree
- **Check Point**: [퀴즈] 탭에서 글쓰기 진입 시 퀴즈 템플릿이 추가된 글쓰기 화면으로 이동된다.
  - Execution Path: 톡게시판 진입 → [퀴즈] 탭 선택 → 글쓰기 진입
  - Preconditions: -
  - Target: PostEditor
  - Expected State: QuizTemplate=Added
  - Evidence: Screenshot, ComponentTree

### 공지 글쓰기

- **Check Point**: 공지로 글쓰기 시 톡게시판에 공지로 게시글이 추가된다.
  - Execution Path: 톡게시판 진입 → 공지로 글쓰기 → 게시
  - Preconditions: -
  - Target: TalkBoard
  - Expected State: NoticePost=Added
  - Evidence: Screenshot, APIResponse
- **Check Point**: 공지 글쓰기 시 채팅방 공지 영역에 작성한 글이 표시된다.
  - Execution Path: 공지로 글쓰기 완료 → 채팅방 진입
  - Preconditions: -
  - Target: NoticeBanner
  - Expected State: NoticeBanner=Shown
  - Evidence: Screenshot
- **Check Point**: 공지 글쓰기 시 채팅방에 공지 게시글 확인하기 말풍선이 전송된다.
  - Execution Path: 공지로 글쓰기 완료 → 채팅방 진입
  - Preconditions: -
  - Target: Bubble
  - Expected State: NoticeCheckBubble=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 공지 게시글 확인하기 말풍선 탭 시 해당 글로 랜딩된다.
  - Execution Path: 채팅방 진입 → 공지 게시글 확인하기 말풍선 탭
  - Preconditions: 확인하기 말풍선 전송 상태
  - Target: Post
  - Expected State: PostDetail=Landed
  - Evidence: Screenshot

### 멘션 글쓰기

- **Check Point**: 멘션(@) 버튼으로 멤버를 멘션한 글쓰기 시 멘션이 포함된 게시글이 추가된다.
  - Execution Path: 톡게시판 진입 → 글쓰기 진입 → 멘션(@) 버튼으로 멤버 멘션 → 게시
  - Preconditions: -
  - Target: TalkBoard
  - Expected State: MentionPost=Added
  - Evidence: Screenshot, APIResponse
- **Check Point**: 멘션 글쓰기 시 채팅방에 멘션이 포함된 게시글 확인하기 말풍선이 전송된다.
  - Execution Path: 멘션 글쓰기 완료 → 채팅방 진입
  - Preconditions: -
  - Target: Bubble
  - Expected State: PostCheckBubble=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 멘션 게시글 확인하기 말풍선 탭 시 해당 글로 랜딩된다.
  - Execution Path: 채팅방 진입 → 게시글 확인하기 말풍선 탭
  - Preconditions: 확인하기 말풍선 전송 상태
  - Target: Post
  - Expected State: PostDetail=Landed
  - Evidence: Screenshot

## 게시글 미디어 첨부·재생·다운로드

### 사진/동영상 첨부

- **Check Point**: 사진 또는 동영상을 첨부한 글쓰기 시 미디어가 첨부된 게시글이 추가된다.
  - Execution Path: 톡게시판 진입 → 글쓰기 진입 → 사진/동영상 첨부 → 게시
  - Preconditions: 미디어 접근 권한 허용
  - Target: TalkBoard
  - Expected State: MediaPost=Added
  - Evidence: Screenshot, APIResponse
- **Check Point**: 사진/동영상 게시글이 톡게시판의 사진(또는 동영상) 탭에 소팅된다.
  - Execution Path: 미디어 글쓰기 완료 → 톡게시판 사진/동영상 탭 확인
  - Preconditions: -
  - Target: TalkBoard
  - Expected State: MediaPost.SortedTab=Photo/Video
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 사진/동영상 첨부 시 채팅방에 본문 및 미디어가 포함된 게시글 말풍선이 전송된다.
  - Execution Path: 미디어 글쓰기 완료 → 채팅방 진입
  - Preconditions: -
  - Target: Bubble
  - Expected State: MediaPostBubble=Sent
  - Evidence: Screenshot, APIResponse

### 파일 첨부

- **Check Point**: 파일을 첨부한 글쓰기 시 파일이 첨부된 게시글이 추가된다.
  - Execution Path: 톡게시판 진입 → 글쓰기 진입 → 파일 첨부 → 게시
  - Preconditions: -
  - Target: TalkBoard
  - Expected State: FilePost=Added
  - Evidence: Screenshot, APIResponse
- **Check Point**: 파일 게시글이 톡게시판의 파일 탭에 소팅된다.
  - Execution Path: 파일 글쓰기 완료 → 톡게시판 파일 탭 확인
  - Preconditions: -
  - Target: TalkBoard
  - Expected State: FilePost.SortedTab=File
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 파일 첨부 시 채팅방에 본문 및 파일명이 포함된 게시글 말풍선이 전송된다.
  - Execution Path: 파일 글쓰기 완료 → 채팅방 진입
  - Preconditions: -
  - Target: Bubble
  - Expected State: FilePostBubble=Sent
  - Evidence: Screenshot, APIResponse

### 투표 첨부

- **Check Point**: 투표를 첨부한 글쓰기 시 투표가 첨부된 게시글이 추가된다.
  - Execution Path: 톡게시판 진입 → 글쓰기 진입 → 투표 첨부 → 게시
  - Preconditions: -
  - Target: TalkBoard
  - Expected State: PollPost=Added
  - Evidence: Screenshot, APIResponse
- **Check Point**: 투표 게시글이 톡게시판의 투표 탭에 소팅된다.
  - Execution Path: 투표 글쓰기 완료 → 톡게시판 투표 탭 확인
  - Preconditions: -
  - Target: TalkBoard
  - Expected State: PollPost.SortedTab=Poll
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 투표 첨부 시 채팅방에 투표 게시글 말풍선이 전송된다.
  - Execution Path: 투표 글쓰기 완료 → 채팅방 진입
  - Preconditions: -
  - Target: Bubble
  - Expected State: PollPostBubble=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 투표 게시글 말풍선 탭 시 해당 투표로 랜딩된다.
  - Execution Path: 채팅방 진입 → 투표 게시글 말풍선 탭
  - Preconditions: 투표 게시글 말풍선 전송 상태
  - Target: Post
  - Expected State: PollDetail=Landed
  - Evidence: Screenshot

### 퀴즈 첨부

- **Check Point**: 퀴즈를 첨부한 글쓰기 시 퀴즈가 첨부된 게시글이 추가된다.
  - Execution Path: 톡게시판 진입 → 글쓰기 진입 → 퀴즈 첨부 → 게시
  - Preconditions: -
  - Target: TalkBoard
  - Expected State: QuizPost=Added
  - Evidence: Screenshot, APIResponse
- **Check Point**: 퀴즈 게시글이 톡게시판의 퀴즈 탭에 소팅된다.
  - Execution Path: 퀴즈 글쓰기 완료 → 톡게시판 퀴즈 탭 확인
  - Preconditions: -
  - Target: TalkBoard
  - Expected State: QuizPost.SortedTab=Quiz
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 퀴즈 첨부 시 채팅방에 퀴즈 게시글 말풍선이 전송된다.
  - Execution Path: 퀴즈 글쓰기 완료 → 채팅방 진입
  - Preconditions: -
  - Target: Bubble
  - Expected State: QuizPostBubble=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 퀴즈 게시글 말풍선 탭 시 해당 퀴즈로 랜딩된다.
  - Execution Path: 채팅방 진입 → 퀴즈 게시글 말풍선 탭
  - Preconditions: 퀴즈 게시글 말풍선 전송 상태
  - Target: Post
  - Expected State: QuizDetail=Landed
  - Evidence: Screenshot

### 미디어 재생·다운로드

- **Check Point**: 사진/동영상/파일 게시글에서 첨부된 미디어를 뷰하면 미디어가 표시/재생된다.
  - Execution Path: 게시글 상세 진입 → 첨부 미디어 탭
  - Preconditions: 미디어가 첨부된 게시글
  - Target: MediaViewer
  - Expected State: Media=Played
  - Evidence: Screenshot, Video
- **Check Point**: 사진/동영상/파일 게시글에서 첨부된 미디어를 다운로드하면 기기의 저장 공간에 다운로드된다.
  - Execution Path: 게시글 상세 진입 → 첨부 미디어 다운로드
  - Preconditions: 미디어가 첨부된 게시글, 저장소 접근 권한 허용
  - Target: MediaViewer
  - Expected State: Media=Downloaded
  - Evidence: Screenshot, Log

## 게시물 인터랙션(더보기)

### 더보기 메뉴 노출

- **Check Point**: 게시글 우상단 [더보기(…)] 버튼 탭 시 게시물 타입·현재 상태에 맞는 메뉴가 표시된다.
  - Execution Path: 게시글 상세 진입 → 우상단 [더보기(…)] 버튼 탭
  - Preconditions: -
  - Target: ContextMenu
  - Expected State: ContextMenu=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 투표 게시글인 경우 더보기 메뉴에 [투표 현황 보기]가 표시된다.
  - Execution Path: 게시글 상세 진입 → [더보기(…)] 버튼 탭
  - Preconditions: 투표 게시글
  - Target: ContextMenu
  - Expected State: Menu.투표현황보기=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 내가 작성한 글이 아닌 경우 더보기 메뉴에 [신고하기]가 표시된다.
  - Execution Path: 게시글 상세 진입 → [더보기(…)] 버튼 탭
  - Preconditions: 타인이 작성한 게시글
  - Target: ContextMenu
  - Expected State: Menu.신고하기=Shown
  - Evidence: Screenshot, ComponentTree

### 공유하기

- **Check Point**: [현재 채팅방에 공유하기] 선택 시 채팅방에 게시글 공유 말풍선이 전송된다.
  - Execution Path: 더보기 메뉴 노출 → [현재 채팅방에 공유하기] 선택
  - Preconditions: -
  - Target: Bubble
  - Expected State: SharePostBubble=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 전송된 공유 말풍선 탭 시 해당 게시글로 랜딩된다.
  - Execution Path: 채팅방 진입 → 게시글 공유 말풍선 탭
  - Preconditions: 공유 말풍선 전송 상태
  - Target: Post
  - Expected State: PostDetail=Landed
  - Evidence: Screenshot

### 공지 등록·내리기

- **Check Point**: [공지 등록하기] 선택 시 게시글이 공지로 추가된다.
  - Execution Path: 더보기 메뉴 노출 → [공지 등록하기] 선택
  - Preconditions: 공지 미등록 게시글
  - Target: Post
  - Expected State: Post.Notice=Registered
  - Evidence: Screenshot, APIResponse
- **Check Point**: 공지 등록 시 채팅방 공지 영역에 등록한 글이 표시된다.
  - Execution Path: 공지 등록 → 채팅방 진입
  - Preconditions: -
  - Target: NoticeBanner
  - Expected State: NoticeBanner=Shown
  - Evidence: Screenshot
- **Check Point**: 공지 등록 시 채팅방에 공지 게시글 확인하기 말풍선이 전송된다.
  - Execution Path: 공지 등록 → 채팅방 진입
  - Preconditions: -
  - Target: Bubble
  - Expected State: NoticeCheckBubble=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: [공지 내리기] 선택 시 채팅방 공지 영역이 사라진다.
  - Execution Path: 더보기 메뉴 노출 → [공지 내리기] 선택 → 채팅방 진입
  - Preconditions: 공지 등록된 게시글
  - Target: NoticeBanner
  - Expected State: NoticeBanner=Hidden
  - Evidence: Screenshot
- **Check Point**: 공지 내리기 시 공지 내리기 말풍선 전송이 없다.
  - Execution Path: [공지 내리기] 선택 → 채팅방 진입
  - Preconditions: 공지 등록된 게시글
  - Target: Bubble
  - Expected State: NoticeDownBubble=NotSent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 공지 내리기 시 톡게시판 공지 탭의 소팅에서 제외된다.
  - Execution Path: [공지 내리기] 선택 → 톡게시판 공지 탭 확인
  - Preconditions: 공지 등록된 게시글
  - Target: TalkBoard
  - Expected State: Post.NoticeTab=Excluded
  - Evidence: Screenshot, ComponentTree

### 수정·신고·삭제

- **Check Point**: [수정하기] 선택 후 수정 완료 시 수정한 내용대로 글이 게시된다.
  - Execution Path: 더보기 메뉴 노출 → [수정하기] 선택 → 내용 수정 → 완료
  - Preconditions: 내가 작성한 게시글
  - Target: Post
  - Expected State: Post=Updated
  - Evidence: Screenshot, APIResponse
- **Check Point**: [신고하기] 선택 시 신고 페이지로 랜딩된다.
  - Execution Path: 더보기 메뉴 노출 → [신고하기] 선택
  - Preconditions: 타인이 작성한 게시글
  - Target: ReportPage
  - Expected State: ReportPage=Landed
  - Evidence: Screenshot
- **Check Point**: [삭제하기] 선택 시 게시글이 삭제된다.
  - Execution Path: 더보기 메뉴 노출 → [삭제하기] 선택
  - Preconditions: -
  - Target: Post
  - Expected State: Post=Deleted
  - Evidence: Screenshot, APIResponse

## 게시글 리액션

### 좋아요

- **Check Point**: 게시글 상세에서 [좋아요(♡)] 탭 시 좋아요 버튼이 채워진다.
  - Execution Path: 게시글 상세 진입 → [좋아요(♡)] 탭
  - Preconditions: -
  - Target: LikeButton
  - Expected State: LikeButton=Filled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 좋아요 카운트가 1로 증가할 때 좋아요한 친구들 항목이 생성되고 내 프로필이 목록에 표시된다.
  - Execution Path: 게시글 상세 진입 → [좋아요(♡)] 탭
  - Preconditions: 좋아요 카운트 0에서 1로 증가
  - Target: LikeList
  - Expected State: MyProfile=Listed
  - Evidence: Screenshot, ComponentTree

### 댓글

- **Check Point**: 게시글 상세에서 댓글 작성 시 작성한 댓글이 게시글 상세에 표시된다.
  - Execution Path: 게시글 상세 진입 → 댓글 작성 → 등록
  - Preconditions: -
  - Target: CommentList
  - Expected State: Comment=Displayed
  - Evidence: Screenshot, APIResponse

### 투표하기

- **Check Point**: 투표 게시글에 투표 완료 시 투표한 카운트가 투표 게시글에 반영된다.
  - Execution Path: 투표 게시글 상세 진입 → 투표 완료
  - Preconditions: 투표 게시글
  - Target: Poll
  - Expected State: VoteCount=Updated
  - Evidence: Screenshot, APIResponse

### 퀴즈 풀기

- **Check Point**: 퀴즈 게시글에서 항목 선택 후 제출 시 선택한 항목 카운트 및 정답 여부가 게시글에 반영된다.
  - Execution Path: 퀴즈 게시글 상세 진입 → 항목 선택 → 제출하기
  - Preconditions: 종료 후 정답 공개 off 퀴즈 게시글
  - Target: Quiz
  - Expected State: AnswerCount=Updated
  - Evidence: Screenshot, APIResponse
- **Check Point**: 정답 선택 시 짧은 햅틱 반응과 애니메이션이 재생된다.
  - Execution Path: 퀴즈 게시글 상세 진입 → 정답 항목 선택 → 제출하기
  - Preconditions: 종료 후 정답 공개 off 퀴즈 게시글
  - Target: Quiz
  - Expected State: Haptic=Short,Animation=Played
  - Evidence: Video, Log
- **Check Point**: 오답 선택 시 긴 햅틱 반응이 발생한다.
  - Execution Path: 퀴즈 게시글 상세 진입 → 오답 항목 선택 → 제출하기
  - Preconditions: 종료 후 정답 공개 off 퀴즈 게시글
  - Target: Quiz
  - Expected State: Haptic=Long
  - Evidence: Log, Video

# 채팅방 UI 레이아웃

> 검증 그룹 7 · 항목 19 · 체크포인트 80

## 채팅방 전체 레이아웃

### 3대 영역 노출

- **Check Point**: 채팅방 진입 시 상단 영역이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입
  - Preconditions: 로그인 계정
  - Target: Header
  - Expected State: Header=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 채팅방 진입 시 말풍선·날짜 피드메시지가 포함된 채팅 영역이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입
  - Preconditions: 로그인 계정
  - Target: ChatArea
  - Expected State: ChatArea=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 채팅방 진입 시 입력 영역이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 채팅방 진입
  - Preconditions: 로그인 계정
  - Target: InputBar
  - Expected State: InputBar=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 공지가 설정된 경우 채팅 영역 상단에 공지가 노출된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 로그인 계정, 공지 설정 있음
  - Target: Notice
  - Expected State: Notice=Visible
  - Evidence: Screenshot, ComponentTree

## 상단 영역

### 상단 구성요소 노출

- **Check Point**: 상단 영역에 뒤로 가기 아이콘이 노출된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 로그인 계정
  - Target: BackButton
  - Expected State: BackButton=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 상단 영역에 검색 아이콘이 노출된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 로그인 계정
  - Target: SearchButton
  - Expected State: SearchButton=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 상단 영역에 사이드 메뉴 아이콘이 노출된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 로그인 계정
  - Target: SideMenuButton
  - Expected State: SideMenuButton=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: iOS에서 안읽은 메시지가 있는 경우 상단에 안읽은 메시지 수가 노출된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 로그인 계정, OS=iOS, 안읽은 메시지 있음
  - Target: UnreadCountBadge
  - Expected State: UnreadCountBadge=Visible
  - Evidence: Screenshot, OCR
- **Check Point**: 나와의 채팅방에서는 상단에 톡클라우드 아이콘이 노출된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 로그인 계정, 나와의 채팅방
  - Target: TalkCloudButton
  - Expected State: TalkCloudButton=Visible
  - Evidence: Screenshot, ComponentTree

### 채팅방명 표시

- **Check Point**: 1:1 채팅방에서는 채팅방명으로 대화상대 닉네임이 표시된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: HeaderTitle
  - Expected State: HeaderTitle=PeerNickname
  - Evidence: Screenshot, OCR
- **Check Point**: 그룹 채팅방에서는 채팅방명으로 생성 시 설정한 이름과 방 인원이 표시된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 로그인 계정, 그룹 채팅방
  - Target: HeaderTitle
  - Expected State: HeaderTitle=RoomName+MemberCount
  - Evidence: Screenshot, OCR
- **Check Point**: 나와의 채팅방에서는 채팅방명으로 내 메인프로필 닉네임이 표시된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 로그인 계정, 나와의 채팅방
  - Target: HeaderTitle
  - Expected State: HeaderTitle=MyNickname
  - Evidence: Screenshot, OCR

### 상단 액션

- **Check Point**: 뒤로 가기 아이콘 탭 시 채팅 목록 페이지로 이동된다.
  - Execution Path: 채팅방 진입 → 뒤로 가기 아이콘 탭
  - Preconditions: 로그인 계정
  - Target: ChatListPage
  - Expected State: Navigate=ChatListPage
  - Evidence: Screenshot
- **Check Point**: 무료 사용자가 톡클라우드 아이콘 탭 시 톡클라우드 구독 매대로 이동된다.
  - Execution Path: 나와의 채팅방 진입 → 톡클라우드 아이콘 탭
  - Preconditions: 로그인 계정, 나와의 채팅방, 무료 사용자
  - Target: TalkCloudHome
  - Expected State: Navigate=SubscriptionPromotion
  - Evidence: Screenshot
- **Check Point**: 유료 사용자가 톡클라우드 아이콘 탭 시 톡클라우드 홈으로 이동된다.
  - Execution Path: 나와의 채팅방 진입 → 톡클라우드 아이콘 탭
  - Preconditions: 로그인 계정, 나와의 채팅방, 유료 사용자
  - Target: TalkCloudHome
  - Expected State: Navigate=TalkCloudHome
  - Evidence: Screenshot

## 입력 영역

### 키보드 비활성 상태

- **Check Point**: 입력 영역에 플러스 메뉴 아이콘이 노출된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 로그인 계정, 키보드 비활성 상태
  - Target: PlusMenuButton
  - Expected State: PlusMenuButton=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 입력 영역에 입력창이 노출된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 로그인 계정, 키보드 비활성 상태
  - Target: MessageInput
  - Expected State: MessageInput=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 입력 영역에 이모티콘 아이콘이 노출된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 로그인 계정, 키보드 비활성 상태
  - Target: EmoticonButton
  - Expected State: EmoticonButton=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 카나나 검색 OFF 시 입력 영역에 #검색 아이콘이 노출된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 로그인 계정, 키보드 비활성 상태, 카나나 검색 OFF
  - Target: HashSearchButton
  - Expected State: HashSearchButton=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 카나나 검색 ON 시 입력 영역에 카나나 검색 아이콘이 노출된다.
  - Execution Path: 채팅방 진입
  - Preconditions: 로그인 계정, 키보드 비활성 상태, 카나나 검색 ON
  - Target: KananaSearchButton
  - Expected State: KananaSearchButton=Visible
  - Evidence: Screenshot, ComponentTree

### 키보드 활성 상태

- **Check Point**: 키보드 툴바 활성화 상태에서 입력창 선택 시 키보드 툴바가 노출된다.
  - Execution Path: 채팅방 진입 → 입력창 선택
  - Preconditions: 로그인 계정, 설정>채팅>키보드 툴바 활성화
  - Target: KeyboardToolbar
  - Expected State: KeyboardToolbar=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 입력창 선택 시 하단 키보드가 노출된다.
  - Execution Path: 채팅방 진입 → 입력창 선택
  - Preconditions: 로그인 계정
  - Target: Keyboard
  - Expected State: Keyboard=Opened
  - Evidence: Screenshot

## 채팅방 검색 전환

### 검색 화면 전환

- **Check Point**: 검색 아이콘 탭 시 검색 화면으로 전환된다.
  - Execution Path: 채팅방 진입 → 검색 아이콘 탭
  - Preconditions: 로그인 계정
  - Target: SearchView
  - Expected State: SearchView=Shown
  - Evidence: Screenshot
- **Check Point**: 검색 화면 전환 시 메시지 검색 입력란에 커서가 포커싱된다.
  - Execution Path: 채팅방 진입 → 검색 아이콘 탭
  - Preconditions: 로그인 계정
  - Target: SearchInput
  - Expected State: SearchInput=Focused
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 검색 화면 전환 시 키보드가 올라온다.
  - Execution Path: 채팅방 진입 → 검색 아이콘 탭
  - Preconditions: 로그인 계정
  - Target: Keyboard
  - Expected State: Keyboard=Opened
  - Evidence: Screenshot
- **Check Point**: 책갈피 설정이 있는 경우 검색 입력란 placeholder로 "대화내용 검색"이 표시된다.
  - Execution Path: 채팅방 진입 → 검색 아이콘 탭
  - Preconditions: 로그인 계정, 검색어 입력 없음, 책갈피 설정 있음
  - Target: SearchInput
  - Expected State: SearchInput.Placeholder=대화내용 검색
  - Evidence: Screenshot, OCR
- **Check Point**: 책갈피 설정이 없는 경우 검색 입력란 placeholder로 "메시지 검색"이 표시된다.
  - Execution Path: 채팅방 진입 → 검색 아이콘 탭
  - Preconditions: 로그인 계정, 검색어 입력 없음, 책갈피 설정 없음
  - Target: SearchInput
  - Expected State: SearchInput.Placeholder=메시지 검색
  - Evidence: Screenshot, OCR

### 검색 옵션

- **Check Point**: 책갈피 설정이 있는 경우 검색 옵션에 인물필터·타임머신·책갈피가 노출된다.
  - Execution Path: 채팅방 진입 → 검색 아이콘 탭
  - Preconditions: 로그인 계정, 책갈피 설정 있음
  - Target: SearchOptionBar
  - Expected State: SearchOptionBar.Options=인물필터/타임머신/책갈피
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 책갈피 설정이 없는 경우 검색 옵션에 인물필터·타임머신만 노출된다.
  - Execution Path: 채팅방 진입 → 검색 아이콘 탭
  - Preconditions: 로그인 계정, 책갈피 설정 없음
  - Target: SearchOptionBar
  - Expected State: SearchOptionBar.Options=인물필터/타임머신
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 설정된 태그가 있는 경우 검색 화면에 태그 필터가 노출된다.
  - Execution Path: 채팅방 진입 → 검색 아이콘 탭
  - Preconditions: 로그인 계정, 설정된 태그 있음
  - Target: TagFilter
  - Expected State: TagFilter=Visible
  - Evidence: Screenshot, ComponentTree

## 사이드 메뉴

### 진입 및 헤더

- **Check Point**: 사이드 메뉴 아이콘 탭 시 풀뷰 구조의 사이드 메뉴가 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정
  - Target: SideMenu
  - Expected State: SideMenu=FullView
  - Evidence: Screenshot
- **Check Point**: 사이드 메뉴 헤더 좌측에 Back 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정
  - Target: SideMenuHeader
  - Expected State: BackButton=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 1:1·그룹 채팅방의 사이드 메뉴 헤더 우측에 알림·즐겨찾기·설정 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방
  - Target: SideMenuHeader
  - Expected State: HeaderActions=알림/즐겨찾기/설정
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 나와의 채팅방의 사이드 메뉴 헤더 우측에 알림·설정 버튼이 노출된다.
  - Execution Path: 나와의 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 나와의 채팅방
  - Target: SideMenuHeader
  - Expected State: HeaderActions=알림/설정
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 스크롤 이동 시 사이드 메뉴 헤더 영역이 고정되어 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭 → 목록 스크롤
  - Preconditions: 로그인 계정
  - Target: SideMenuHeader
  - Expected State: SideMenuHeader=Sticky
  - Evidence: Screenshot, Video

### 프로필·채팅방 정보

- **Check Point**: 1:1 채팅방 사이드 메뉴에 상대방 프로필 사진과 프로필명이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: ProfileInfo
  - Expected State: ProfileInfo=PeerProfile
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 그룹 채팅방 사이드 메뉴에 채팅방 사진과 채팅방명이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 그룹 채팅방
  - Target: ProfileInfo
  - Expected State: ProfileInfo=RoomProfile
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 나와의 채팅방 사이드 메뉴에 내 프로필 사진과 채팅방 이름이 노출된다.
  - Execution Path: 나와의 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 나와의 채팅방
  - Target: ProfileInfo
  - Expected State: ProfileInfo=MyProfile
  - Evidence: Screenshot, ComponentTree

### 기능 버튼

- **Check Point**: 1:1·그룹 채팅방 사이드 메뉴 상단 기능 버튼이 사진/동영상·파일·링크·일정 순서로 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방
  - Target: TopFunctionButtons
  - Expected State: TopFunctionButtons=사진/동영상,파일,링크,일정
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 1:1·그룹 채팅방 사이드 메뉴 중단 기능 버튼이 게시판·공지·투표·통화 순서로 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방
  - Target: MiddleFunctionButtons
  - Expected State: MiddleFunctionButtons=게시판,공지,투표,통화
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 1:1·그룹 채팅방 사이드 메뉴에 챗봇 beta 메뉴가 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방
  - Target: ChatbotBetaMenu
  - Expected State: ChatbotBetaMenu=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 나와의 채팅방 사이드 메뉴 상단 기능 버튼이 사진/동영상·파일·링크·게시판 순서로 노출된다.
  - Execution Path: 나와의 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 나와의 채팅방
  - Target: TopFunctionButtons
  - Expected State: TopFunctionButtons=사진/동영상,파일,링크,게시판
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 나와의 채팅방 사이드 메뉴 브리핑 보드에 일정·할 일·예약 메시지가 노출된다.
  - Execution Path: 나와의 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 나와의 채팅방
  - Target: BriefingBoard
  - Expected State: BriefingBoard=일정,할 일,예약 메시지
  - Evidence: Screenshot, ComponentTree

### 대화상대 목록

- **Check Point**: 1:1·나와의 채팅방 사이드 메뉴 대화상대 목록 타이틀로 '대화상대'가 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 1:1 또는 나와의 채팅방
  - Target: MemberListTitle
  - Expected State: MemberListTitle=대화상대
  - Evidence: Screenshot, OCR
- **Check Point**: 그룹 채팅방 사이드 메뉴 대화상대 목록 타이틀로 '대화상대'와 참여자 수가 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 그룹 채팅방
  - Target: MemberListTitle
  - Expected State: MemberListTitle=대화상대+ParticipantCount
  - Evidence: Screenshot, OCR
- **Check Point**: 1:1·그룹 채팅방 사이드 메뉴 대화상대 영역에 [+ 초대하기] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방
  - Target: InviteButton
  - Expected State: InviteButton=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 사이드 메뉴에 대화상대 목록이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정
  - Target: MemberList
  - Expected State: MemberList=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 그룹 채팅방 대화상대가 50명 초과인 경우 대화상대 전체보기/접기 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 그룹 채팅방, 대화상대 50명 초과
  - Target: MemberListToggleButton
  - Expected State: MemberListToggleButton=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 그룹 채팅방 대화상대가 50명 이하인 경우 대화상대 전체보기/접기 버튼이 미노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 그룹 채팅방, 대화상대 50명 이하
  - Target: MemberListToggleButton
  - Expected State: MemberListToggleButton=Hidden
  - Evidence: Screenshot, ComponentTree

### 대화상대 항목 상태

- **Check Point**: 대화상대 목록에서 본인 항목은 닉네임 좌측에 '나' 표시가 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정
  - Target: MemberItem
  - Expected State: MemberItem=MeLabel
  - Evidence: Screenshot, OCR
- **Check Point**: 친구가 아닌 대화상대 항목은 프로필 이미지 내 ? 아이콘과 닉네임 우측 친구 추가 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 친구 아닌 대화상대 있음
  - Target: MemberItem
  - Expected State: MemberItem=NotFriend
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 차단 상태 대화상대 항목은 프로필 이미지 내 금지 아이콘이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 차단 대화상대 있음
  - Target: MemberItem
  - Expected State: MemberItem=Blocked
  - Evidence: Screenshot, ComponentTree

### 하단 버튼

- **Check Point**: 1:1 채팅방 사이드 메뉴 하단에 [비밀채팅방 만들기] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: SecretChatButton
  - Expected State: SecretChatButton=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 그룹 채팅방 사이드 메뉴 하단에 [채팅방 다시 만들기] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 그룹 채팅방
  - Target: RecreateRoomButton
  - Expected State: RecreateRoomButton=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 1:1·그룹 채팅방 사이드 메뉴 하단에 [채팅방 나가기] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방
  - Target: LeaveRoomButton
  - Expected State: LeaveRoomButton=Visible
  - Evidence: Screenshot, ComponentTree

## 채팅방 설정

### 설정 페이지 구성

- **Check Point**: 채팅방 설정 페이지 헤더 좌측에 Back 버튼과 '채팅방 설정' 타이틀이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭 → 설정 진입
  - Preconditions: 로그인 계정
  - Target: RoomSettingsHeader
  - Expected State: RoomSettingsHeader=Back+채팅방 설정
  - Evidence: Screenshot, OCR
- **Check Point**: 1:1 채팅방 설정 페이지에 상대방 프로필 사진·프로필명·[편집] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭 → 설정 진입
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: RoomInfo
  - Expected State: RoomInfo=PeerProfile+EditButton
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 그룹 채팅방 설정 페이지에 채팅방 사진·채팅방명·[편집] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭 → 설정 진입
  - Preconditions: 로그인 계정, 그룹 채팅방
  - Target: RoomInfo
  - Expected State: RoomInfo=RoomProfile+EditButton
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 채팅방 설정 메뉴가 현재 채팅방 배경화면·알림음·입력창 잠금 순서로 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭 → 설정 진입
  - Preconditions: 로그인 계정
  - Target: RoomSettingMenu
  - Expected State: RoomSettingMenu=배경화면,알림음,입력창 잠금
  - Evidence: Screenshot, OCR
- **Check Point**: 채팅방 데이터 메뉴가 채팅방 데이터 관리·대화 내용 내보내기 순서로 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭 → 설정 진입
  - Preconditions: 로그인 계정
  - Target: RoomDataMenu
  - Expected State: RoomDataMenu=데이터 관리,대화 내용 내보내기
  - Evidence: Screenshot, OCR
- **Check Point**: Android에서 기타 메뉴에 '홈 화면에 바로가기 추가'가 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭 → 설정 진입
  - Preconditions: 로그인 계정, OS=Android
  - Target: EtcMenu
  - Expected State: EtcMenu=홈 화면에 바로가기 추가
  - Evidence: Screenshot, OCR

### 하단 버튼

- **Check Point**: 1:1 채팅방 설정 페이지 하단에 [채팅방 나가기] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭 → 설정 진입
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: LeaveRoomButton
  - Expected State: LeaveRoomButton=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 그룹 채팅방 설정 페이지 하단에 [채팅방 나가기] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭 → 설정 진입
  - Preconditions: 로그인 계정, 그룹 채팅방
  - Target: LeaveRoomButton
  - Expected State: LeaveRoomButton=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 그룹 채팅방 설정 페이지 하단에 [초대 거부 및 나가기] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭 → 설정 진입
  - Preconditions: 로그인 계정, 그룹 채팅방
  - Target: RejectAndLeaveButton
  - Expected State: RejectAndLeaveButton=Visible
  - Evidence: Screenshot, ComponentTree

### 설정 액션

- **Check Point**: 설정 페이지에서 뒤로 가기 아이콘 탭 시 진입 전 페이지로 이동된다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 아이콘 탭 → 설정 진입 → 뒤로 가기 아이콘 탭
  - Preconditions: 로그인 계정
  - Target: RoomSettingsPage
  - Expected State: Navigate=PreviousPage
  - Evidence: Screenshot
- **Check Point**: 나와의 채팅방 프로필 사진 설정에서 내 프로필 사진이 변경 불가 상태로 표시된다.
  - Execution Path: 나와의 채팅방 진입 → 사이드 메뉴 아이콘 탭 → 설정 진입 → 채팅방 설정>편집>채팅방 정보>프로필 사진 설정
  - Preconditions: 로그인 계정, 나와의 채팅방
  - Target: ProfileImage
  - Expected State: ProfileImage=ReadOnly
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 나와의 채팅방 프로필 사진 설정에서 채팅방 이름이 편집 가능하다.
  - Execution Path: 나와의 채팅방 진입 → 사이드 메뉴 아이콘 탭 → 설정 진입 → 채팅방 설정>편집>채팅방 정보>프로필 사진 설정
  - Preconditions: 로그인 계정, 나와의 채팅방
  - Target: RoomNameField
  - Expected State: RoomNameField=Editable
  - Evidence: Screenshot, ComponentTree

## 뮤직 모달뷰

### 모달뷰 UI

- **Check Point**: 뮤직 모달뷰 상단에 < 버튼·홈 버튼·'뮤직' 타이틀·X 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → ＋ 메뉴 탭 → 뮤직 탭
  - Preconditions: 로그인 계정
  - Target: MusicModalHeader
  - Expected State: MusicModalHeader=Back+Home+뮤직+Close
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 뮤직 모달뷰에 검색 필드가 노출된다.
  - Execution Path: 채팅방 진입 → ＋ 메뉴 탭 → 뮤직 탭
  - Preconditions: 로그인 계정
  - Target: SearchField
  - Expected State: SearchField=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 뮤직 모달뷰에 최근들은·좋아요한 카테고리가 노출되며 기본값은 최근들은이다.
  - Execution Path: 채팅방 진입 → ＋ 메뉴 탭 → 뮤직 탭
  - Preconditions: 로그인 계정
  - Target: CategoryTab
  - Expected State: CategoryTab=최근들은
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 멜론 계정이 연동된 경우 선택된 카테고리의 곡 리스트가 노출된다.
  - Execution Path: 채팅방 진입 → ＋ 메뉴 탭 → 뮤직 탭
  - Preconditions: 로그인 계정, 멜론 계정 연동
  - Target: SongList
  - Expected State: SongList=Visible
  - Evidence: Screenshot, APIResponse
- **Check Point**: 멜론 계정이 미연동된 경우 연동 안내가 노출된다.
  - Execution Path: 채팅방 진입 → ＋ 메뉴 탭 → 뮤직 탭
  - Preconditions: 로그인 계정, 멜론 계정 미연동
  - Target: MelonLinkGuide
  - Expected State: MelonLinkGuide=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 프로모션 배너가 존재하는 경우 뮤직 모달뷰에 배너가 노출된다.
  - Execution Path: 채팅방 진입 → ＋ 메뉴 탭 → 뮤직 탭
  - Preconditions: 로그인 계정, 프로모션 배너 존재
  - Target: Banner
  - Expected State: Banner=Visible
  - Evidence: Screenshot, ComponentTree

### 모달뷰 액션

- **Check Point**: 곡 썸네일 영역 탭 시 선택한 곡의 상세 정보 웹뷰 화면으로 이동된다.
  - Execution Path: 뮤직 모달뷰 진입 → 곡 썸네일 영역 탭
  - Preconditions: 로그인 계정, 멜론 계정 연동
  - Target: SongDetailWebView
  - Expected State: Navigate=SongDetailWebView
  - Evidence: Screenshot
- **Check Point**: 곡 선택 후 [보내기] 버튼 탭 시 선택한 곡의 말풍선이 채팅방에 공유된다.
  - Execution Path: 뮤직 모달뷰 진입 → 곡 선택 → 보내기 버튼 탭
  - Preconditions: 로그인 계정, 멜론 계정 연동
  - Target: MusicBubble
  - Expected State: MusicBubble=Shared
  - Evidence: Screenshot, APIResponse
- **Check Point**: [보내기] 버튼 탭 시 뮤직 웹뷰가 닫힌다.
  - Execution Path: 뮤직 모달뷰 진입 → 곡 선택 → 보내기 버튼 탭
  - Preconditions: 로그인 계정, 멜론 계정 연동
  - Target: MusicModal
  - Expected State: MusicModal=Closed
  - Evidence: Screenshot
- **Check Point**: 이전 웹뷰 화면이 있는 상태에서 < 버튼 탭 시 이전 화면으로 이동된다.
  - Execution Path: 뮤직 모달뷰 진입 → 곡 상세 웹뷰 이동 → < 버튼 탭
  - Preconditions: 로그인 계정, 이전 웹뷰 화면 있음
  - Target: WebView
  - Expected State: Navigate=PreviousWebView
  - Evidence: Screenshot
- **Check Point**: 이전 웹뷰 화면이 없는 상태에서 < 버튼 탭 시 뮤직 웹뷰가 닫힌다.
  - Execution Path: 뮤직 모달뷰 진입 → < 버튼 탭
  - Preconditions: 로그인 계정, 이전 웹뷰 화면 없음
  - Target: MusicModal
  - Expected State: MusicModal=Closed
  - Evidence: Screenshot
- **Check Point**: 홈 버튼 탭 시 뮤직 웹뷰 메인으로 이동된다.
  - Execution Path: 뮤직 모달뷰 진입 → 곡 상세 웹뷰 이동 → 홈 버튼 탭
  - Preconditions: 로그인 계정
  - Target: WebView
  - Expected State: Navigate=MusicMain
  - Evidence: Screenshot
- **Check Point**: X 버튼 탭 시 뮤직 웹뷰 모달뷰가 닫힌다.
  - Execution Path: 뮤직 모달뷰 진입 → X 버튼 탭
  - Preconditions: 로그인 계정
  - Target: MusicModal
  - Expected State: MusicModal=Closed
  - Evidence: Screenshot

# 채팅방 관리·설정

> 검증 그룹 9 · 항목 24 · 체크포인트 80

## 채팅방 알림 설정

### 알림 ON→OFF 전환

- **Check Point**: 알림 아이콘 탭 시 알림 OFF 상태 아이콘으로 변경된다.
  - Execution Path: 채팅방 진입 → 알림 아이콘 탭
  - Preconditions: 로그인 계정, 알림 ON 상태
  - Target: NotificationIcon
  - Expected State: NotificationIcon=Off
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 알림 해제 시 '채팅방 알림이 해제되었습니다.' 토스트가 노출된다.
  - Execution Path: 채팅방 진입 → 알림 아이콘 탭
  - Preconditions: OS=Android, 알림 ON 상태
  - Target: Toast
  - Expected State: Toast=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 알림 OFF 상태에서 메시지 수신 시 진동·소리 및 알림센터 알림이 발생하지 않는다.
  - Execution Path: 알림 OFF 설정 → 채팅목록 → 채팅방 메시지 수신
  - Preconditions: 알림 OFF 상태, 상대 계정에서 메시지 발신
  - Target: NotificationCenter
  - Expected State: Notification=Suppressed
  - Evidence: Screenshot, Log
- **Check Point**: 알림 OFF 상태에서 메시지 수신 시 채팅탭 및 해당 채팅방 안읽은 메시지 카운트는 증가한다.
  - Execution Path: 알림 OFF 설정 → 채팅목록 → 채팅방 메시지 수신
  - Preconditions: 알림 OFF 상태, 상대 계정에서 메시지 발신
  - Target: UnreadBadge
  - Expected State: UnreadCount=Increased
  - Evidence: Screenshot, ComponentTree

### 알림 OFF→ON 전환

- **Check Point**: 알림 아이콘 탭 시 알림 ON 상태 아이콘으로 변경된다.
  - Execution Path: 채팅방 진입 → 알림 아이콘 탭
  - Preconditions: 로그인 계정, 알림 OFF 상태
  - Target: NotificationIcon
  - Expected State: NotificationIcon=On
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 알림 설정 시 '채팅방 알림이 설정되었습니다.' 토스트가 노출된다.
  - Execution Path: 채팅방 진입 → 알림 아이콘 탭
  - Preconditions: OS=Android, 알림 OFF 상태
  - Target: Toast
  - Expected State: Toast=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 알림 ON 상태에서 메시지 수신 시 진동·소리 및 알림센터 알림이 발생한다.
  - Execution Path: 알림 ON 설정 → 채팅목록 → 채팅방 메시지 수신
  - Preconditions: 알림 ON 상태, 상대 계정에서 메시지 발신
  - Target: NotificationCenter
  - Expected State: Notification=Shown
  - Evidence: Screenshot, Log
- **Check Point**: 알림 ON 상태에서 메시지 수신 시 채팅탭 및 해당 채팅방 안읽은 메시지 카운트가 증가한다.
  - Execution Path: 알림 ON 설정 → 채팅목록 → 채팅방 메시지 수신
  - Preconditions: 알림 ON 상태, 상대 계정에서 메시지 발신
  - Target: UnreadBadge
  - Expected State: UnreadCount=Increased
  - Evidence: Screenshot, ComponentTree

## 즐겨찾기 설정

### 즐겨찾기 설정

- **Check Point**: 즐겨찾기 아이콘 탭 시 즐겨찾기 설정 상태 아이콘으로 변경된다.
  - Execution Path: 채팅방 진입 → 즐겨찾기 아이콘 탭
  - Preconditions: 로그인 계정, 즐겨찾기 미설정 상태
  - Target: FavoriteIcon
  - Expected State: FavoriteIcon=On
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 즐겨찾기 추가 시 '즐겨찾기에 추가되었습니다.' 토스트가 노출된다.
  - Execution Path: 채팅방 진입 → 즐겨찾기 아이콘 탭
  - Preconditions: OS=Android, 즐겨찾기 미설정 상태
  - Target: Toast
  - Expected State: Toast=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 1:1 채팅방을 즐겨찾기 설정하면 친구탭 즐겨찾기 영역에 해당 친구가 노출된다.
  - Execution Path: 즐겨찾기 설정 → 친구탭 이동 → 즐겨찾기 영역 확인
  - Preconditions: 채팅방 종류=1:1, 즐겨찾기 설정 완료
  - Target: FavoriteSection
  - Expected State: FavoriteSection.Friend=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 그룹채팅방은 25/8차부터 친구탭 내 즐겨찾기 영역에 노출되지 않는다.
  - Execution Path: 즐겨찾기 설정 → 친구탭 이동 → 즐겨찾기 영역 확인
  - Preconditions: 채팅방 종류=그룹, 앱 버전>=25/8차
  - Target: FavoriteSection
  - Expected State: FavoriteSection=Hidden
  - Evidence: Screenshot, ComponentTree

### 즐겨찾기 해제

- **Check Point**: 즐겨찾기 아이콘 탭 시 즐겨찾기 해제 상태 아이콘으로 변경된다.
  - Execution Path: 채팅방 진입 → 즐겨찾기 아이콘 탭
  - Preconditions: 로그인 계정, 즐겨찾기 설정된 상태
  - Target: FavoriteIcon
  - Expected State: FavoriteIcon=Off
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 즐겨찾기 해제 시 '즐겨찾기에서 해제되었습니다.' 토스트가 노출된다.
  - Execution Path: 채팅방 진입 → 즐겨찾기 아이콘 탭
  - Preconditions: OS=Android, 즐겨찾기 설정된 상태
  - Target: Toast
  - Expected State: Toast=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 즐겨찾기 해제 시 친구탭 즐겨찾기 영역에서 해당 친구 및 채팅방이 노출되지 않는다.
  - Execution Path: 즐겨찾기 해제 → 친구탭 이동 → 즐겨찾기 영역 확인
  - Preconditions: 즐겨찾기 설정된 상태
  - Target: FavoriteSection
  - Expected State: FavoriteSection.Item=Hidden
  - Evidence: Screenshot, ComponentTree

## 채팅방 나가기

### 나가기 얼럿 노출

- **Check Point**: 1:1 채팅방에서 채팅방 나가기 탭 시 프로필 사진·채팅방명·'채팅방을 나가시겠어요?'와 [취소][나가기] 버튼을 포함한 얼럿이 노출된다.
  - Execution Path: 채팅방 설정 진입 → 채팅방 나가기 탭
  - Preconditions: 채팅방 종류=1:1
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 그룹채팅방 나가기 얼럿에는 '조용히 나가기' 옵션이 함께 노출된다.
  - Execution Path: 채팅방 설정 진입 → 채팅방 나가기 탭
  - Preconditions: 채팅방 종류=그룹
  - Target: Alert
  - Expected State: Alert.QuietLeaveOption=Shown
  - Evidence: Screenshot, ComponentTree

### 나가기 얼럿 동작

- **Check Point**: 나가기 얼럿에서 [취소] 탭 시 얼럿이 닫히고 채팅방이 유지된다.
  - Execution Path: 채팅방 나가기 탭 → 얼럿 [취소] 탭
  - Preconditions: 나가기 얼럿 노출 상태
  - Target: Alert
  - Expected State: Alert=Dismissed
  - Evidence: Screenshot
- **Check Point**: 나가기 얼럿에서 [나가기] 탭 시 채팅방 나가기가 처리되고 채팅목록에서 사라진다.
  - Execution Path: 채팅방 나가기 탭 → 얼럿 [나가기] 탭
  - Preconditions: 나가기 얼럿 노출 상태
  - Target: ChatList
  - Expected State: ChatRoom=Removed
  - Evidence: Screenshot, APIResponse

## 채팅방 설정 진입·재생성

### 채팅방 설정 진입

- **Check Point**: 사이드 메뉴 > 설정 아이콘 탭 시 채팅방 설정 화면으로 이동한다.
  - Execution Path: 채팅방 진입 → 사이드 메뉴 열기 → 설정 아이콘 탭
  - Preconditions: 로그인 계정
  - Target: ChatRoomSettings
  - Expected State: ChatRoomSettings=Displayed
  - Evidence: Screenshot

### 채팅방 다시 만들기

- **Check Point**: 채팅방 다시 만들기 버튼 탭 시 일반채팅·팀채팅 메뉴가 노출된다.
  - Execution Path: 채팅방 설정 진입 → 채팅방 다시 만들기 버튼 탭
  - Preconditions: 로그인 계정
  - Target: Menu
  - Expected State: Menu=Shown
  - Evidence: Screenshot, ComponentTree

### 채팅방 정보 편집 진입

- **Check Point**: [편집] 버튼 탭 시 채팅방 정보 페이지로 이동한다.
  - Execution Path: 채팅방 설정 진입 → [편집] 버튼 탭
  - Preconditions: 로그인 계정
  - Target: ChatRoomInfo
  - Expected State: ChatRoomInfo=Displayed
  - Evidence: Screenshot

## 채팅방 정보 편집

### 채팅방 정보 페이지 구성

- **Check Point**: 채팅방 정보 페이지 헤더에 좌측 Back 버튼·'채팅방 정보' 타이틀·[확인] 버튼이 노출된다.
  - Execution Path: 채팅방 설정 진입 → [편집] 버튼 탭
  - Preconditions: 채팅방 정보 페이지 노출 상태
  - Target: Header
  - Expected State: Header=Displayed
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 1:1 채팅방 정보 페이지에는 상대방 프로필 사진이 편집 불가 상태로 노출된다.
  - Execution Path: 채팅방 설정 진입 → [편집] 버튼 탭
  - Preconditions: 채팅방 종류=1:1
  - Target: ProfileImage
  - Expected State: ProfileImage=ReadOnly
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 채팅방 이름 편집 메뉴에 '채팅방 이름' 메뉴명과 우측 입력 카운트 'n/50'이 노출된다.
  - Execution Path: 채팅방 설정 진입 → [편집] 버튼 탭
  - Preconditions: 채팅방 정보 페이지 노출 상태
  - Target: NameEditField
  - Expected State: CharCounter=n/50
  - Evidence: Screenshot, OCR
- **Check Point**: 1:1 채팅방 이름 입력창은 디폴트로 상대방 프로필명이 입력된 상태로 노출된다.
  - Execution Path: 채팅방 설정 진입 → [편집] 버튼 탭
  - Preconditions: 채팅방 종류=1:1
  - Target: NameEditField
  - Expected State: NameEditField.Default=ProfileName
  - Evidence: Screenshot, OCR
- **Check Point**: 그룹 채팅방 이름 입력창은 디폴트로 채팅방명이 입력된 상태로 노출된다.
  - Execution Path: 채팅방 설정 진입 → [편집] 버튼 탭
  - Preconditions: 채팅방 종류=그룹
  - Target: NameEditField
  - Expected State: NameEditField.Default=RoomName
  - Evidence: Screenshot, OCR
- **Check Point**: 채팅방 이름 입력창에 입력 시 우측에 [x] 전체삭제 버튼이 노출된다.
  - Execution Path: 채팅방 정보 페이지 진입 → 채팅방 이름 입력
  - Preconditions: 채팅방 정보 페이지 노출 상태
  - Target: ClearButton
  - Expected State: ClearButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 채팅방 이름 입력창이 미입력 상태이면 [x] 전체삭제 버튼이 노출되지 않는다.
  - Execution Path: 채팅방 정보 페이지 진입 → 입력창 전체 삭제
  - Preconditions: 채팅방 정보 페이지 노출 상태
  - Target: ClearButton
  - Expected State: ClearButton=Hidden
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 1:1 채팅방 이름 편집 하단에 '내가 설정한 채팅방 이름은 나에게만 보입니다.' 안내 문구가 노출된다.
  - Execution Path: 채팅방 설정 진입 → [편집] 버튼 탭
  - Preconditions: 채팅방 종류=1:1
  - Target: GuideText
  - Expected State: GuideText=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 그룹 채팅방 정보 미설정 시 채팅방 사진·채팅방명 영역이 노출되고 하단에 '내가 설정한 사진과 이름은 나에게만 보입니다.' 안내 문구가 노출된다.
  - Execution Path: 채팅방 설정 진입 → [편집] 버튼 탭
  - Preconditions: 채팅방 종류=그룹, 채팅방 정보 미설정 상태
  - Target: GuideText
  - Expected State: GuideText=Shown
  - Evidence: Screenshot, OCR

### 채팅방 사진 변경

- **Check Point**: [앨범에서 사진 선택]으로 앨범 내 사진 선택 시 선택한 프로필 사진으로 변경된다.
  - Execution Path: 채팅방 정보 페이지 진입 → [앨범에서 사진 선택] 탭 → 앨범 내 사진 선택
  - Preconditions: 미디어 접근 권한 허용
  - Target: ProfileImage
  - Expected State: ProfileImage=Changed
  - Evidence: Screenshot
- **Check Point**: [사진 촬영] 또는 앨범 내 [사진 촬영]으로 촬영 시 촬영한 프로필 사진으로 변경된다.
  - Execution Path: 채팅방 정보 페이지 진입 → 사진 촬영 → 프로필 사진 설정
  - Preconditions: 카메라 접근 권한 허용
  - Target: ProfileImage
  - Expected State: ProfileImage=Changed
  - Evidence: Screenshot
- **Check Point**: [커스텀 프로필 만들기]로 프로필 생성 시 커스텀 프로필로 변경된다.
  - Execution Path: 채팅방 정보 페이지 진입 → [커스텀 프로필 만들기] 탭 → 커스텀 프로필 생성
  - Preconditions: 로그인 계정
  - Target: ProfileImage
  - Expected State: ProfileImage=Custom
  - Evidence: Screenshot
- **Check Point**: [기본 이미지로 적용] 탭 시 생성 시 설정되었던 기본 이미지로 다시 변경된다.
  - Execution Path: 채팅방 정보 페이지 진입 → [기본 이미지로 적용] 탭
  - Preconditions: 프로필 사진 등록된 상태
  - Target: ProfileImage
  - Expected State: ProfileImage=Default
  - Evidence: Screenshot
- **Check Point**: [확인] 버튼 선택 시 변경된 채팅방 사진이 친구 목록 및 채팅 목록에 반영된다.
  - Execution Path: 채팅방 사진 변경 → [확인] 버튼 탭
  - Preconditions: 채팅방 사진 변경 상태
  - Target: FriendList
  - Expected State: ProfileImage=Applied
  - Evidence: Screenshot, APIResponse

### 채팅방 이름 변경

- **Check Point**: 채팅방 이름 변경 후 [확인] 버튼 탭 시 설정한 이름으로 채팅방 이름이 변경된다.
  - Execution Path: 채팅방 정보 페이지 진입 → 채팅방 이름 변경 → [확인] 버튼 탭
  - Preconditions: 채팅방 정보 페이지 노출 상태
  - Target: ChatRoomTitle
  - Expected State: ChatRoomTitle=Changed
  - Evidence: Screenshot, APIResponse

## 채팅방 배경화면

### 배경 적용

- **Check Point**: [색상 배경]에서 색상 선택 시 상단 미리보기 및 해당 채팅방이 선택한 색상 배경으로 적용된다.
  - Execution Path: 채팅방 설정 진입 → [색상 배경] 탭 → 색상 선택
  - Preconditions: 로그인 계정
  - Target: ChatBackground
  - Expected State: ChatBackground=Color
  - Evidence: Screenshot
- **Check Point**: [일러스트 배경]에서 선택 시 상단 미리보기 및 해당 채팅방이 선택한 일러스트 배경으로 적용된다.
  - Execution Path: 채팅방 설정 진입 → [일러스트 배경] 탭 → 일러스트 선택
  - Preconditions: 로그인 계정
  - Target: ChatBackground
  - Expected State: ChatBackground=Illustration
  - Evidence: Screenshot
- **Check Point**: [앨범에서 사진 선택]으로 사진 선택 시 상단 미리보기 및 해당 채팅방이 선택한 사진 배경으로 적용된다.
  - Execution Path: 채팅방 설정 진입 → [앨범에서 사진 선택] 탭 → 앨범 내 사진 선택
  - Preconditions: 미디어 접근 권한 허용
  - Target: ChatBackground
  - Expected State: ChatBackground=Photo
  - Evidence: Screenshot
- **Check Point**: [테마 배경 적용] 탭 시 상단 미리보기 및 해당 채팅방이 테마에 설정된 배경으로 적용된다.
  - Execution Path: 채팅방 설정 진입 → [테마 배경 적용] 탭
  - Preconditions: 테마 적용된 경우
  - Target: ChatBackground
  - Expected State: ChatBackground=Theme
  - Evidence: Screenshot

### 기본 배경화면 초기화

- **Check Point**: [기본 배경화면 적용] 탭 시 '배경화면 초기화' 얼럿이 노출된다.
  - Execution Path: 채팅방 설정 진입 → [기본 배경화면 적용] 탭
  - Preconditions: 로그인 계정
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 배경화면 초기화 얼럿에서 [취소] 탭 시 얼럿이 닫히며 초기화되지 않는다.
  - Execution Path: [기본 배경화면 적용] 탭 → 얼럿 [취소] 탭
  - Preconditions: 배경화면 초기화 얼럿 노출 상태
  - Target: Alert
  - Expected State: Alert=Dismissed
  - Evidence: Screenshot
- **Check Point**: 배경화면 초기화 얼럿에서 [초기화] 탭 시 얼럿이 닫히며 배경화면이 초기화된다.
  - Execution Path: [기본 배경화면 적용] 탭 → 얼럿 [초기화] 탭
  - Preconditions: 배경화면 초기화 얼럿 노출 상태
  - Target: ChatBackground
  - Expected State: ChatBackground=Reset
  - Evidence: Screenshot

## 채팅방 알림음·입력창 잠금

### 현재 채팅방 알림음

- **Check Point**: [현재 채팅방 알림음] 탭 시 알림음 선택 화면이 노출된다.
  - Execution Path: 채팅방 설정 진입 → [현재 채팅방 알림음] 탭
  - Preconditions: 로그인 계정
  - Target: SoundPicker
  - Expected State: SoundPicker=Shown
  - Evidence: Screenshot
- **Check Point**: 알림음 선택 시 선택한 알림음으로 변경되고 메시지 수신 시 해당 알림음으로 수신된다.
  - Execution Path: [현재 채팅방 알림음] 탭 → 알림음 선택 → 메시지 수신
  - Preconditions: 알림 ON 상태, 상대 계정에서 메시지 발신
  - Target: SoundPicker
  - Expected State: NotificationSound=Selected
  - Evidence: Log, Screenshot

### 현재 채팅방 입력창 잠금

- **Check Point**: 입력창 잠금 옵션 ON 시 채팅방 입력 영역이 잠금 상태로 노출되고 플러스 버튼·입력 영역이 비활성화된다.
  - Execution Path: 채팅방 설정 진입 → 입력창 잠금 옵션 ON
  - Preconditions: 로그인 계정
  - Target: MessageInput
  - Expected State: MessageInput=Locked
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 입력창 잠금 상태에서 입력 영역에 잠금 해제 버튼이 노출된다.
  - Execution Path: 입력창 잠금 옵션 ON → 채팅방 진입
  - Preconditions: 입력창 잠금 ON 상태
  - Target: UnlockButton
  - Expected State: UnlockButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 입력창 잠금 옵션 OFF 시 채팅방 입력 영역이 잠금 해제되어 채팅 바로 입력이 가능하다.
  - Execution Path: 채팅방 설정 진입 → 입력창 잠금 옵션 OFF
  - Preconditions: 입력창 잠금 ON 상태
  - Target: MessageInput
  - Expected State: MessageInput=Unlocked
  - Evidence: Screenshot, ComponentTree

## 채팅방 데이터 관리

### 데이터 관리 진입 구성

- **Check Point**: 채팅방 관리 - 채팅방 데이터 관리 메뉴에 전체 캐시 용량이 0.00MB 형식으로 표시된다.
  - Execution Path: 채팅방 설정 진입 → 채팅방 관리 영역 이동
  - Preconditions: 로그인 계정
  - Target: DataManagementMenu
  - Expected State: CacheSize=0.00MB형식
  - Evidence: Screenshot, OCR
- **Check Point**: 채팅방 데이터 관리 메뉴 탭 시 타이틀·프로필 사진·채팅방명·참여자 수와 삭제 항목들을 포함한 바텀 시트가 노출된다.
  - Execution Path: 채팅방 관리 영역 이동 → 채팅방 데이터 관리 메뉴 탭
  - Preconditions: 로그인 계정
  - Target: BottomSheet
  - Expected State: BottomSheet=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: iOS 채팅방 데이터 관리 바텀 시트에는 '파일 데이터 삭제' 항목 및 용량 표기가 추가로 노출된다.
  - Execution Path: 채팅방 관리 영역 이동 → 채팅방 데이터 관리 메뉴 탭
  - Preconditions: OS=iOS
  - Target: BottomSheet
  - Expected State: BottomSheet.FileDeleteItem=Shown
  - Evidence: Screenshot, ComponentTree

### 대화 내용 및 미디어 모두 삭제

- **Check Point**: 대화 내용 및 미디어 모두 삭제 탭 시 확인 체크박스와 [취소][삭제] 버튼을 포함한 얼럿이 노출된다.
  - Execution Path: 데이터 관리 바텀 시트 진입 → 대화 내용 및 미디어 모두 삭제 탭
  - Preconditions: 채팅방 내 대화내용·미디어 수발신 내역 존재
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 얼럿에서 [취소] 탭 시 변경사항 없이 얼럿이 닫힌다.
  - Execution Path: 대화 내용 및 미디어 모두 삭제 탭 → 얼럿 [취소] 탭
  - Preconditions: 삭제 얼럿 노출 상태
  - Target: Alert
  - Expected State: Alert=Dismissed
  - Evidence: Screenshot
- **Check Point**: 체크박스 해제 상태에서 [삭제] 탭 시 아무 동작도 일어나지 않는다.
  - Execution Path: 대화 내용 및 미디어 모두 삭제 탭 → 체크박스 해제 → [삭제] 탭
  - Preconditions: 삭제 얼럿 노출 상태
  - Target: DeleteButton
  - Expected State: DeleteButton=Disabled
  - Evidence: Screenshot, Log
- **Check Point**: 체크박스 체크 후 [삭제] 탭 시 바텀 시트가 유지되고 전체 캐시 용량이 0MB로 표시된다.
  - Execution Path: 대화 내용 및 미디어 모두 삭제 탭 → 체크박스 체크 → [삭제] 탭
  - Preconditions: 삭제 얼럿 노출 상태
  - Target: BottomSheet
  - Expected State: CacheSize=0MB
  - Evidence: Screenshot, OCR

### 미디어·사진·동영상·음성·파일 데이터 삭제

- **Check Point**: 미디어 데이터 전체 삭제 탭 시 '미디어 데이터 모두 삭제' 얼럿이 노출된다.
  - Execution Path: 데이터 관리 바텀 시트 진입 → 미디어 데이터 전체 삭제 탭
  - Preconditions: 채팅방 내 미디어 데이터 수발신 내역 존재
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 미디어 데이터 삭제 얼럿에서 [삭제] 탭 시 삭제가 수행되고 전체 캐시 용량이 0MB로 표시된다.
  - Execution Path: 미디어 데이터 전체 삭제 탭 → 얼럿 [삭제] 탭
  - Preconditions: 미디어 데이터 삭제 얼럿 노출 상태
  - Target: BottomSheet
  - Expected State: CacheSize=0MB
  - Evidence: Screenshot, OCR
- **Check Point**: 사진 데이터 삭제 탭 시 '사진 데이터 삭제' 얼럿이 노출된다.
  - Execution Path: 데이터 관리 바텀 시트 진입 → 사진 데이터 삭제 탭
  - Preconditions: 채팅방 내 사진 수발신 내역 존재
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 사진 데이터 삭제 얼럿에서 [삭제] 탭 시 삭제가 수행되고 사진 용량이 0MB로 표시된다.
  - Execution Path: 사진 데이터 삭제 탭 → 얼럿 [삭제] 탭
  - Preconditions: 사진 데이터 삭제 얼럿 노출 상태
  - Target: BottomSheet
  - Expected State: PhotoCacheSize=0MB
  - Evidence: Screenshot, OCR
- **Check Point**: 동영상 데이터 삭제 탭 시 '동영상 데이터 삭제' 얼럿이 노출된다.
  - Execution Path: 데이터 관리 바텀 시트 진입 → 동영상 데이터 삭제 탭
  - Preconditions: 채팅방 내 동영상 수발신 내역 존재
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 동영상 데이터 삭제 얼럿에서 [삭제] 탭 시 삭제가 수행되고 로컬 동영상 용량이 0MB로 표시된다.
  - Execution Path: 동영상 데이터 삭제 탭 → 얼럿 [삭제] 탭
  - Preconditions: 동영상 데이터 삭제 얼럿 노출 상태
  - Target: BottomSheet
  - Expected State: VideoCacheSize=0MB
  - Evidence: Screenshot, OCR
- **Check Point**: 음성 데이터 삭제 탭 시 '음성 데이터 삭제' 얼럿이 노출된다.
  - Execution Path: 데이터 관리 바텀 시트 진입 → 음성 데이터 삭제 탭
  - Preconditions: 채팅방 내 음성 파일 수발신 내역 존재
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 음성 데이터 삭제 얼럿에서 [삭제] 탭 시 삭제가 수행되고 음성 파일 용량이 0MB로 표시된다.
  - Execution Path: 음성 데이터 삭제 탭 → 얼럿 [삭제] 탭
  - Preconditions: 음성 데이터 삭제 얼럿 노출 상태
  - Target: BottomSheet
  - Expected State: VoiceCacheSize=0MB
  - Evidence: Screenshot, OCR
- **Check Point**: iOS 파일 데이터 삭제 탭 시 '파일 데이터 삭제' 얼럿이 노출된다.
  - Execution Path: 데이터 관리 바텀 시트 진입 → 파일 데이터 삭제 탭
  - Preconditions: OS=iOS, 채팅방 내 일반 파일 수발신 내역 존재
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: iOS 파일 데이터 삭제 얼럿에서 [삭제] 탭 시 삭제가 수행되고 파일 용량이 0MB로 표시된다.
  - Execution Path: 파일 데이터 삭제 탭 → 얼럿 [삭제] 탭
  - Preconditions: OS=iOS, 파일 데이터 삭제 얼럿 노출 상태
  - Target: BottomSheet
  - Expected State: FileCacheSize=0MB
  - Evidence: Screenshot, OCR
- **Check Point**: 각 데이터 삭제 얼럿에서 [취소] 탭 시 변경사항 없이 얼럿이 닫힌다.
  - Execution Path: 데이터 삭제 탭 → 얼럿 [취소] 탭
  - Preconditions: 데이터 삭제 얼럿 노출 상태
  - Target: Alert
  - Expected State: Alert=Dismissed
  - Evidence: Screenshot
- **Check Point**: 삭제 후 서버 저장기간 이내인 경우 해당 미디어를 탭하면 다시 다운로드된다.
  - Execution Path: 데이터 삭제 수행 → 채팅방 진입 → 미디어 탭
  - Preconditions: 서버 저장기간 이내
  - Target: MediaItem
  - Expected State: Media=Redownloaded
  - Evidence: Screenshot, APIResponse

### 카카오톡 저장공간 관리

- **Check Point**: [카카오톡 저장공간 관리] 탭 시 앱 관리 > 저장공간 관리 화면으로 진입한다.
  - Execution Path: 데이터 관리 바텀 시트 진입 → [카카오톡 저장공간 관리] 탭
  - Preconditions: 로그인 계정
  - Target: StorageManagement
  - Expected State: StorageManagement=Displayed
  - Evidence: Screenshot
- **Check Point**: Android 저장공간 관리에서 [<] 이전 버튼 탭 시 기존 채팅방 설정으로 이동한다.
  - Execution Path: 저장공간 관리 진입 → [<] 이전 버튼 탭
  - Preconditions: OS=Android, 저장공간 관리 화면
  - Target: ChatRoomSettings
  - Expected State: ChatRoomSettings=Displayed
  - Evidence: Screenshot
- **Check Point**: iOS 저장공간 관리에서 [X] 닫기 탭 시 기존 채팅방 설정으로 이동한다.
  - Execution Path: 저장공간 관리 진입 → [X] 닫기 탭
  - Preconditions: OS=iOS, 저장공간 관리 화면
  - Target: ChatRoomSettings
  - Expected State: ChatRoomSettings=Displayed
  - Evidence: Screenshot

## 대화 내용 내보내기

### 내보내기 진입

- **Check Point**: 채팅방 설정 > 대화 내용 내보내기 탭 시 대화 내용 내보내기 페이지로 이동한다.
  - Execution Path: 채팅방 설정 진입 → 대화 내용 내보내기 탭
  - Preconditions: 로그인 계정
  - Target: ChatExportPage
  - Expected State: ChatExportPage=Displayed
  - Evidence: Screenshot

### 텍스트만 보내기

- **Check Point**: Android에서 텍스트만 보내기 탭 시 txt 파일이 첨부된 상태로 OS 액션 시트가 노출된다.
  - Execution Path: 대화 내용 내보내기 진입 → 텍스트만 보내기 탭
  - Preconditions: OS=Android, 대화 내용 내보내기 노출 상태
  - Target: ActionSheet
  - Expected State: ActionSheet=Shown
  - Evidence: Screenshot
- **Check Point**: iOS에서 텍스트만 보내기 탭 시 편지쓰기 페이지로 이동되고 대화내용이 zip 파일로 첨부된다.
  - Execution Path: 대화 내용 내보내기 진입 → 텍스트만 보내기 탭
  - Preconditions: OS=iOS, 단말기 설정에 메일 계정 설정됨
  - Target: MailComposer
  - Expected State: MailComposer=Displayed
  - Evidence: Screenshot

### 모든 메시지 저장

- **Check Point**: Android에서 모든 메시지 내부저장소에 저장 탭 시 저장 위치가 포함된 '저장되었습니다.' 토스트가 노출된다.
  - Execution Path: 대화 내용 내보내기 진입 → 모든 메시지 내부저장소에 저장 탭
  - Preconditions: OS=Android, 대화 내용 내보내기 진입 상태
  - Target: Toast
  - Expected State: Toast=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: Android 저장 후 내 파일 > 해당 경로 접근 시 zip 파일이 존재한다.
  - Execution Path: 모든 메시지 저장 → 내 파일 앱 진입 → 저장 경로 확인
  - Preconditions: OS=Android
  - Target: FileManager
  - Expected State: ZipFile=Exists
  - Evidence: Screenshot, Log
- **Check Point**: iOS에서 모든 메시지 저장 시 완료 체크 이미지가 노출된다.
  - Execution Path: 대화 내용 내보내기 진입 → 모든 메시지 도큐멘트로 저장하기 탭
  - Preconditions: OS=iOS
  - Target: CompletionIcon
  - Expected State: CompletionIcon=Shown
  - Evidence: Screenshot

### 채팅방 저장소에 저장

- **Check Point**: [채팅방 저장소에 저장] 탭 시 채팅방 저장소 업로드 중 화면으로 이동한다.
  - Execution Path: 대화 내용 내보내기 진입 → [채팅방 저장소에 저장] 탭
  - Preconditions: 톡클라우드 유료 사용자
  - Target: UploadScreen
  - Expected State: Upload=InProgress
  - Evidence: Screenshot
- **Check Point**: 업로드 완료 시 완료 화면으로 전환되고 톡클라우드 채널에서 '채팅방 내보내기가 완료되었어요' TMS가 수신된다.
  - Execution Path: [채팅방 저장소에 저장] 탭 → 업로드 완료 대기
  - Preconditions: 톡클라우드 유료 사용자
  - Target: UploadScreen
  - Expected State: Upload=Completed
  - Evidence: Screenshot, APIResponse
- **Check Point**: 업로드 완료 화면에서 [채팅방 저장소 바로가기] 탭 시 채팅방 저장소 목록 웹뷰로 이동한다.
  - Execution Path: 업로드 완료 → [채팅방 저장소 바로가기] 탭
  - Preconditions: 톡클라우드 유료 사용자, 업로드 완료 상태
  - Target: WebView
  - Expected State: StorageList=Displayed
  - Evidence: Screenshot

# 입력창 메시지 작성

> 검증 그룹 8 · 항목 27 · 체크포인트 69

## 입력창 기본 UI 구성

### 문자 미입력 상태 아이콘

- **Check Point**: 문자 미입력 시 입력창 좌측에 플러스 메뉴 아이콘이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 1:1 채팅방 진입
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: MessageInput
  - Expected State: PlusButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 문자 미입력 시 입력창 우측에 이모티콘 아이콘이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 1:1 채팅방 진입
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: MessageInput
  - Expected State: EmoticonButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 문자 미입력 시 입력창 우측에 #검색 아이콘이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅탭 → 1:1 채팅방 진입
  - Preconditions: 로그인 계정, 1:1 채팅방, 카나나 검색 beta OFF
  - Target: SearchButton
  - Expected State: SearchButton=HashSearch
  - Evidence: Screenshot, ComponentTree

### 문자 입력 상태 아이콘

- **Check Point**: 문자 입력 시 우측 #검색 아이콘이 전송 아이콘으로 변경된다.
  - Execution Path: 1:1 채팅방 진입 → 입력창 텍스트 입력
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: SendButton
  - Expected State: SendButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 문자 입력 시 전송 아이콘이 활성화된다.
  - Execution Path: 1:1 채팅방 진입 → 입력창 텍스트 입력
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: SendButton
  - Expected State: SendButton=Enabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 문자 입력 시 입력창에 AI 아이콘이 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 입력창 텍스트 입력
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: MessageInput
  - Expected State: AiButton=Shown
  - Evidence: Screenshot, ComponentTree

### 카나나 검색 조건부 노출

- **Check Point**: 카나나 검색 beta ON 시 문자 미입력 상태에서 카나나 검색 아이콘이 노출된다.
  - Execution Path: 더보기탭 → 설정 → 카나나 → 카나나 검색 beta ON → 1:1 채팅방 진입
  - Preconditions: 로그인 계정, 1:1 채팅방, 카나나 검색 beta ON
  - Target: SearchButton
  - Expected State: SearchButton=KananaSearch
  - Evidence: Screenshot, ComponentTree

### 다중 줄 입력창 렌더링

- **Check Point**: 여러 줄 입력 시에도 입력창 원형 테두리가 깨짐 없이 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 입력창 최대 텍스트 입력(5~6줄)
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: MessageInput
  - Expected State: MessageInput.Border=Intact
  - Evidence: Screenshot

## 상대방 입력 중 상태 표시

### 입력 중 아이콘 설정 반영

- **Check Point**: 입력 중 상태보기 ON 시 상대방 텍스트 입력에 입력 중(...) 아이콘이 표시된다.
  - Execution Path: 1:1 채팅방 진입 → 상대방이 입력창에 텍스트 입력
  - Preconditions: 로그인 계정, 1:1 채팅방, 설정 > 채팅 > 메시지 입력 중 상태보기 ON
  - Target: TypingIndicator
  - Expected State: TypingIndicator=Shown
  - Evidence: Screenshot
- **Check Point**: 입력 중 상태보기 OFF 시 상대방 텍스트 입력에 입력 중(...) 아이콘이 표시되지 않는다.
  - Execution Path: 1:1 채팅방 진입 → 상대방이 입력창에 텍스트 입력
  - Preconditions: 로그인 계정, 1:1 채팅방, 설정 > 채팅 > 메시지 입력 중 상태보기 OFF
  - Target: TypingIndicator
  - Expected State: TypingIndicator=Hidden
  - Evidence: Screenshot

## 특정 입력 모드 진입 및 종료

### 플러스 메뉴 모드

- **Check Point**: [+] 플러스 버튼 탭 시 입력창과 플러스 메뉴 영역이 분리되어 노출된다.
  - Execution Path: 1:1 채팅방 진입 → [+] 플러스 버튼 탭
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: PlusMenu
  - Expected State: InputMode=PlusMenu
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 플러스 메뉴 모드 진입 시 입력창 좌측에 [X] 버튼이 노출된다.
  - Execution Path: 1:1 채팅방 진입 → [+] 플러스 버튼 탭
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: CloseButton
  - Expected State: CloseButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: [X] 버튼 탭 시 플러스 메뉴 모드가 해제된다.
  - Execution Path: 1:1 채팅방 진입 → [+] 플러스 버튼 탭 → [X] 버튼 탭
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: PlusMenu
  - Expected State: InputMode=Default
  - Evidence: Screenshot
- **Check Point**: 플러스 메뉴 모드 해제 후 쿼티 키패드가 유지된다.
  - Execution Path: 1:1 채팅방 진입 → [+] 플러스 버튼 탭 → [X] 버튼 탭
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: Keyboard
  - Expected State: Keyboard=Shown
  - Evidence: Screenshot

### 사진 모달뷰 모드

- **Check Point**: 플러스 메뉴 [사진] 선택 시 사진 모달뷰가 노출된다.
  - Execution Path: 1:1 채팅방 진입 → [+] 플러스 버튼 탭 → [사진] 메뉴 선택
  - Preconditions: 로그인 계정, 1:1 채팅방, 미디어 접근 권한 허용
  - Target: PhotoModal
  - Expected State: PhotoModal=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 사진 모달뷰 상단 좌측에 [X] 버튼이 노출된다.
  - Execution Path: 1:1 채팅방 진입 → [+] 플러스 버튼 탭 → [사진] 메뉴 선택
  - Preconditions: 로그인 계정, 1:1 채팅방, 미디어 접근 권한 허용
  - Target: CloseButton
  - Expected State: CloseButton=Shown
  - Evidence: Screenshot
- **Check Point**: 사진 모달뷰 상단 우측에 [전송] 버튼이 노출된다.
  - Execution Path: 1:1 채팅방 진입 → [+] 플러스 버튼 탭 → [사진] 메뉴 선택
  - Preconditions: 로그인 계정, 1:1 채팅방, 미디어 접근 권한 허용
  - Target: SendButton
  - Expected State: SendButton=Shown
  - Evidence: Screenshot
- **Check Point**: 사진 모달뷰에서 [X] 버튼 탭 시 플러스 메뉴 모드가 해제되고 쿼티 키패드가 유지된다.
  - Execution Path: 1:1 채팅방 진입 → [+] 플러스 버튼 탭 → [사진] 메뉴 선택 → [X] 버튼 탭
  - Preconditions: 로그인 계정, 1:1 채팅방, 미디어 접근 권한 허용
  - Target: Keyboard
  - Expected State: InputMode=Default, Keyboard=Shown
  - Evidence: Screenshot

### 답장 모드

- **Check Point**: 말풍선을 답장 모드로 변경 시 입력창 블릿이 제거된 답장 레이어가 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 임의 말풍선 스와이프 또는 롱탭 메뉴 > 답장 탭
  - Preconditions: 로그인 계정, 1:1 채팅방, 수신 말풍선 존재
  - Target: ReplyLayer
  - Expected State: InputMode=Reply
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 답장 모드 진입 시 '답장 메시지 입력' 안내문구가 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 임의 말풍선 답장 모드로 변경
  - Preconditions: 로그인 계정, 1:1 채팅방, 수신 말풍선 존재
  - Target: ReplyLayer
  - Expected State: Placeholder=답장 메시지 입력
  - Evidence: Screenshot, OCR
- **Check Point**: 답장 모드에서 답장 메시지 입력 시 전송 버튼이 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 임의 말풍선 답장 모드로 변경 → 답장 메시지 입력
  - Preconditions: 로그인 계정, 1:1 채팅방, 수신 말풍선 존재
  - Target: SendButton
  - Expected State: SendButton=Shown
  - Evidence: Screenshot

### 플러스 메뉴 항목 구성

- **Check Point**: 플러스 메뉴에 사진·카메라·선물하기·지도·뮤직·미니게임·공개투표·파일·톡클라우드·연락처·음성메시지·예약메시지·캡처·일정 순으로 메뉴가 노출된다.
  - Execution Path: 나와의 채팅방 진입 → [+] 플러스 메뉴 확인
  - Preconditions: 로그인 계정, 나와의 채팅방
  - Target: PlusMenu
  - Expected State: PlusMenu.Items=[사진,카메라,선물하기,지도,뮤직,미니게임,공개투표,파일,톡클라우드,연락처,음성메시지,예약메시지,캡처,일정]
  - Evidence: Screenshot, ComponentTree

## 링크 및 스크랩 미리보기

### 미리보기 없는 링크

- **Check Point**: 미리보기가 없는 링크 주소 입력 시 링크 레이어가 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 미리보기 없는 링크 주소 입력
  - Preconditions: 로그인 계정, 1:1 채팅방, 미리보기 없는 링크(www.daum.ne)
  - Target: LinkPreview
  - Expected State: LinkPreview=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 미리보기 없는 링크 레이어에 '미리보기가 없습니다.' 안내문구가 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 미리보기 없는 링크 주소 입력
  - Preconditions: 로그인 계정, 1:1 채팅방, 미리보기 없는 링크(www.daum.ne)
  - Target: LinkPreview
  - Expected State: LinkPreview.Message=미리보기가 없습니다.
  - Evidence: Screenshot, OCR
- **Check Point**: 미리보기 없는 링크 레이어에 링크 주소가 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 미리보기 없는 링크 주소 입력
  - Preconditions: 로그인 계정, 1:1 채팅방, 미리보기 없는 링크(www.daum.ne)
  - Target: LinkPreview
  - Expected State: LinkPreview.Url=Shown
  - Evidence: Screenshot, OCR

### 미리보기 있는 링크

- **Check Point**: 미리보기가 있는 링크 주소 입력 시 링크 레이어가 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 미리보기 있는 링크 주소 입력
  - Preconditions: 로그인 계정, 1:1 채팅방, 미리보기 있는 링크(www.daum.net)
  - Target: LinkPreview
  - Expected State: LinkPreview=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 미리보기 있는 링크 레이어에 사이트명과 사이트 이미지가 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 미리보기 있는 링크 주소 입력
  - Preconditions: 로그인 계정, 1:1 채팅방, 미리보기 있는 링크(www.daum.net)
  - Target: LinkPreview
  - Expected State: LinkPreview.SiteName=Shown, LinkPreview.Thumbnail=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 미리보기 있는 링크 레이어에 링크 주소가 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 미리보기 있는 링크 주소 입력
  - Preconditions: 로그인 계정, 1:1 채팅방, 미리보기 있는 링크(www.daum.net)
  - Target: LinkPreview
  - Expected State: LinkPreview.Url=Shown
  - Evidence: Screenshot, OCR

### 스크랩 미리보기 영역

- **Check Point**: 스크랩 URL 입력 시 입력창 상단 스크랩 미리보기 영역이 활성화된다.
  - Execution Path: 1:1 채팅방 진입 → 입력창에 스크랩 URL 입력 → 입력창 상단 확인
  - Preconditions: 로그인 계정, 1:1 채팅방, 입력창에 스크랩 URL 입력한 상태
  - Target: ScrapPreview
  - Expected State: ScrapPreview=Active
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 스크랩 미리보기 영역에 링크아이콘·사이트명·URL주소·썸네일 정보가 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 입력창에 스크랩 URL 입력 → 스크랩 미리보기 영역 확인
  - Preconditions: 로그인 계정, 1:1 채팅방, 입력창에 스크랩 URL 입력한 상태
  - Target: ScrapPreview
  - Expected State: ScrapPreview.Fields=[LinkIcon,SiteName,Url,Thumbnail]
  - Evidence: Screenshot, OCR
- **Check Point**: 스크랩 미리보기 영역 탭 시 말풍선 미리보기 화면으로 이동한다.
  - Execution Path: 1:1 채팅방 진입 → 입력창에 스크랩 URL 입력 → 스크랩 미리보기 영역 탭
  - Preconditions: 로그인 계정, 1:1 채팅방, 입력창에 스크랩 URL 입력한 상태
  - Target: ScrapPreview
  - Expected State: Screen=BubblePreview
  - Evidence: Screenshot
- **Check Point**: 입력창에서 URL 정보 삭제 시 스크랩 미리보기 영역이 사라진다.
  - Execution Path: 1:1 채팅방 진입 → 입력창에 스크랩 URL 입력 → 입력창에서 URL 정보 삭제
  - Preconditions: 로그인 계정, 1:1 채팅방, 입력창에 스크랩 URL 입력한 상태
  - Target: ScrapPreview
  - Expected State: ScrapPreview=Hidden
  - Evidence: Screenshot

## 키보드 전환 및 입력 상태 유지

### 키보드 내림 후 메뉴 전환 시 입력 유지

- **Check Point**: 2줄 이상 입력 후 키보드를 내리고 플러스 메뉴 또는 이모티콘 아이콘 탭 시 입력한 내용이 유지된다.
  - Execution Path: 1:1 채팅방 진입 → 2줄 이상 입력 후 키보드 내리기 → 플러스 메뉴 또는 이모티콘 아이콘 탭
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: MessageInput
  - Expected State: MessageInput.Text=Retained
  - Evidence: Screenshot, OCR
- **Check Point**: 2줄 이상 입력 후 키보드를 내리면 #검색 버튼이 전송 버튼으로 변경된다.
  - Execution Path: 1:1 채팅방 진입 → 2줄 이상 입력 후 키보드 내리기
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: SendButton
  - Expected State: SendButton=Shown
  - Evidence: Screenshot
- **Check Point**: iOS에서는 키보드를 내려도 입력창이 확장되지 않는다.
  - Execution Path: 1:1 채팅방 진입 → 2줄 이상 입력 후 키보드 내리기
  - Preconditions: 로그인 계정, 1:1 채팅방, OS=iOS
  - Target: MessageInput
  - Expected State: MessageInput.Expanded=False
  - Evidence: Screenshot
- **Check Point**: Android에서는 임시 저장 메시지 복원 시 입력창이 여러 줄로 확장되어 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 2줄 이상 입력 후 키보드 내리기
  - Preconditions: 로그인 계정, 1:1 채팅방, OS=Android
  - Target: MessageInput
  - Expected State: MessageInput.Expanded=True
  - Evidence: Screenshot

### 이모티콘 키보드 전환

- **Check Point**: 이모티콘 아이콘 탭 시 키보드 영역이 이모티콘 키보드로 변경된다.
  - Execution Path: 1:1 채팅방 진입 → 이모티콘 아이콘 탭
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: Keyboard
  - Expected State: Keyboard=EmoticonMode
  - Evidence: Screenshot, ComponentTree

### 임시저장 메시지 표시

- **Check Point**: 입력창에 텍스트 입력 상태에서 채팅방 목록에 임시저장 메시지 아이콘이 노출된다.
  - Execution Path: 1:1 채팅방 입력창에 텍스트 입력 → 채팅방 목록 아이콘 확인
  - Preconditions: 로그인 계정, 1:1 채팅방, 입력창에 텍스트 입력한 상태
  - Target: ChatListIcon
  - Expected State: DraftIcon=Shown
  - Evidence: Screenshot
- **Check Point**: 임시저장 아이콘 노출 중 메시지 수신 시 언리드카운트 뱃지가 노출된다.
  - Execution Path: 1:1 채팅방 입력창에 텍스트 입력 → 메시지 수신 → 채팅방 목록 아이콘 확인
  - Preconditions: 로그인 계정, 1:1 채팅방, 입력창에 텍스트 입력한 상태, 아이콘 우선순위: 언리드카운트 > 전송 실패 > 작성중
  - Target: ChatListIcon
  - Expected State: UnreadBadge=Shown
  - Evidence: Screenshot
- **Check Point**: 임시저장 메시지를 채팅방으로 전송하면 임시저장 메시지 아이콘이 미노출된다.
  - Execution Path: 1:1 채팅방 입력창에 텍스트 입력 → 임시저장 메시지 전송 → 채팅방 목록 아이콘 확인
  - Preconditions: 로그인 계정, 1:1 채팅방, 입력창에 텍스트 입력한 상태
  - Target: ChatListIcon
  - Expected State: DraftIcon=Hidden
  - Evidence: Screenshot

### 키패드 정상 노출

- **Check Point**: 키보드 노출 후 사라지는 동선에서 키패드 영역이 레이아웃 깨짐 없이 정상 노출된다.
  - Execution Path: 채팅방 진입 → 키보드 노출 후 닫기
  - Preconditions: 로그인 계정, OS 26, 손쉬운 사용 > 동작 줄이기 및 크로스페이드 OFF
  - Target: Keyboard
  - Expected State: Keyboard.Layout=Intact
  - Evidence: Screenshot, Video

## 입력창 비활성화 및 잠금

### 차단 유저 채팅방

- **Check Point**: 차단한 유저와의 채팅방에서 입력창이 비활성화 상태로 노출된다.
  - Execution Path: 차단 유저 채팅방 진입 → 입력창 확인
  - Preconditions: 로그인 계정, 내가 차단한 유저와의 채팅방
  - Target: MessageInput
  - Expected State: MessageInput=Disabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 차단 유저 채팅방 입력창에 '차단친구와는 대화할 수 없습니다.' 문구가 노출된다.
  - Execution Path: 차단 유저 채팅방 진입 → 입력창 확인
  - Preconditions: 로그인 계정, 내가 차단한 유저와의 채팅방
  - Target: MessageInput
  - Expected State: MessageInput.Message=차단친구와는 대화할 수 없습니다.
  - Evidence: Screenshot, OCR

### 탈퇴 유저 채팅방

- **Check Point**: 탈퇴한 유저와의 채팅방에서 입력창이 비활성화 상태로 노출된다.
  - Execution Path: 탈퇴 유저 채팅방 진입 → 입력창 확인
  - Preconditions: 로그인 계정, 탈퇴한 유저와의 채팅방
  - Target: MessageInput
  - Expected State: MessageInput=Disabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 탈퇴 유저 채팅방 입력창에 '대화할 수 없는 사용자입니다.' 문구가 노출된다.
  - Execution Path: 탈퇴 유저 채팅방 진입 → 입력창 확인
  - Preconditions: 로그인 계정, 탈퇴한 유저와의 채팅방
  - Target: MessageInput
  - Expected State: MessageInput.Message=대화할 수 없는 사용자입니다.
  - Evidence: Screenshot, OCR

### 주의 채팅방 입력창 잠금

- **Check Point**: 주의가 필요한 채팅방에서 입력창에 잠금 아이콘이 노출된다.
  - Execution Path: 주의 채팅방 진입 → 입력 영역 확인
  - Preconditions: 로그인 계정, 대화 시 주의가 필요한 채팅방
  - Target: LockButton
  - Expected State: LockButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 잠금 입력창에 '대화할 때 주의가 필요한 방입니다. [잠금 해제]' 문구가 노출된다.
  - Execution Path: 주의 채팅방 진입 → 입력 영역 확인
  - Preconditions: 로그인 계정, 대화 시 주의가 필요한 채팅방
  - Target: MessageInput
  - Expected State: MessageInput.Message=대화할 때 주의가 필요한 방입니다.
  - Evidence: Screenshot, OCR
- **Check Point**: 잠금 아이콘 탭 시 잠금이 해제되어 일반 입력 영역으로 변경된다.
  - Execution Path: 주의 채팅방 진입 → 잠금 아이콘 탭
  - Preconditions: 로그인 계정, 대화 시 주의가 필요한 채팅방
  - Target: MessageInput
  - Expected State: InputLock=Unlocked
  - Evidence: Screenshot
- **Check Point**: 잠금 해제 후 채팅방을 나갔다 재진입 시 입력 영역이 다시 잠금 상태로 노출된다.
  - Execution Path: 잠금 해제 → 채팅 목록으로 back → 해당 채팅방 재진입
  - Preconditions: 로그인 계정, 대화 시 주의가 필요한 채팅방, 잠금 해제 상태
  - Target: MessageInput
  - Expected State: InputLock=Locked
  - Evidence: Screenshot

## 입력 보조 툴바

### 맞춤법 교정

- **Check Point**: 텍스트 입력 후 맞춤법 탭 시 교정된 텍스트가 툴바 하단 영역에 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 텍스트 입력 → 맞춤법 탭
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: Toolbar
  - Expected State: Toolbar.SpellResult=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 교정 텍스트를 입력창에 적용 후 전송하면 교정된 텍스트가 전송된다.
  - Execution Path: 1:1 채팅방 진입 → 텍스트 입력 → 맞춤법 탭 → [입력창에 적용하기] 버튼 탭 → 텍스트 전송
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: Bubble
  - Expected State: SentMessage=Corrected
  - Evidence: Screenshot, APIResponse

### 번역

- **Check Point**: 텍스트 입력 후 번역 탭 시 번역된 텍스트가 툴바 하단 영역에 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 텍스트 입력 → 번역 탭
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: Toolbar
  - Expected State: Toolbar.TranslateResult=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 번역 텍스트를 입력창에 적용 후 전송하면 번역된 텍스트가 전송된다.
  - Execution Path: 1:1 채팅방 진입 → 텍스트 입력 → 번역 탭 → [입력창에 적용하기] 버튼 탭 → 텍스트 전송
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: Bubble
  - Expected State: SentMessage=Translated
  - Evidence: Screenshot, APIResponse

### 챗봇 인기/최근 영역

- **Check Point**: 챗봇 미사용 유저는 챗봇 화면에 인기 영역이 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 챗봇 탭
  - Preconditions: 로그인 계정, 1:1 채팅방, 챗봇 미사용 유저
  - Target: ChatbotSheet
  - Expected State: ChatbotSheet.PopularSection=Shown
  - Evidence: Screenshot
- **Check Point**: 챗봇 사용 유저는 챗봇 화면에 최근 사용 영역과 인기 영역이 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 챗봇 탭
  - Preconditions: 로그인 계정, 1:1 채팅방, 챗봇 사용 유저
  - Target: ChatbotSheet
  - Expected State: ChatbotSheet.Sections=[Recent,Popular]
  - Evidence: Screenshot
- **Check Point**: 챗봇 시트 최하단에 [이용안내] [입점문의] 텍스트 링크 버튼이 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 챗봇 탭 → 챗봇 시트 최하단 확인
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: ChatbotSheet
  - Expected State: ChatbotSheet.FooterLinks=[이용안내,입점문의]
  - Evidence: Screenshot, OCR
- **Check Point**: 인기 영역의 채팅방에 없는 챗봇을 추가하면 도움말 바텀 시트 버튼명이 '제거'로 변경된다.
  - Execution Path: 1:1 채팅방 진입 → 챗봇 탭 → 인기 영역 > 채팅방에 없는 챗봇 탭 → 도움말 바텀 시트 > '추가' 버튼 탭
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: ChatbotHelpSheet
  - Expected State: HelpSheet.Button=제거
  - Evidence: Screenshot, OCR

### 챗봇 최근 사용 명령어

- **Check Point**: 챗봇 명령어 전송 시 챗봇 툴바에 최근 사용 명령어 칩이 최대 8개 노출된다.
  - Execution Path: 1:1 채팅방 진입 → @멘션 또는 / 기호로 챗봇 명령어 전송 → 챗봇 툴바 화면 확인
  - Preconditions: 로그인 계정, 1:1 채팅방
  - Target: ChatbotToolbar
  - Expected State: RecentCommandChips.Count<=8
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 최근 사용 명령어 칩 롱탭 시 칩이 첫 번째 위치로 이동하며 핀 고정된다.
  - Execution Path: 1:1 채팅방 진입 → 챗봇 명령어 전송 → 최근 사용 명령어 칩 롱탭
  - Preconditions: 로그인 계정, 1:1 채팅방, 최근 사용 명령어 칩 존재
  - Target: ChatbotToolbar
  - Expected State: CommandChip=Pinned, Position=First
  - Evidence: Screenshot

## 간편녹음

### 간편 녹음 아이콘 노출 조건

- **Check Point**: 간편녹음 ON, 입력창 커서 없고 키보드 내려간 상태에서 간편 녹음 아이콘이 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 키보드 내림 → 입력창 커서 없음 상태 확인
  - Preconditions: 로그인 계정, 1:1 채팅방, 간편녹음 ON, 키보드 내려간 상태
  - Target: VoiceRecordButton
  - Expected State: VoiceRecordButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 입력창에 커서가 있을 때 간편 녹음 아이콘이 미노출된다.
  - Execution Path: 1:1 채팅방 진입 → 입력창 커서 위치
  - Preconditions: 로그인 계정, 1:1 채팅방, 간편녹음 ON
  - Target: VoiceRecordButton
  - Expected State: VoiceRecordButton=Hidden
  - Evidence: Screenshot
- **Check Point**: 간편녹음 ON 상태에서 입력창에 텍스트 입력 시 전송 버튼(⬆️)이 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 입력창 텍스트 입력
  - Preconditions: 로그인 계정, 1:1 채팅방, 간편녹음 ON
  - Target: SendButton
  - Expected State: SendButton=Shown
  - Evidence: Screenshot

### 간편녹음 UI 진입

- **Check Point**: 간편 녹음 아이콘 롱프레스 시 간편녹음 UI가 모달뷰로 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 간편 녹음 아이콘 영역 롱프레스
  - Preconditions: 로그인 계정, 1:1 채팅방, 간편녹음 ON, 마이크 권한 허용
  - Target: VoiceRecordModal
  - Expected State: VoiceRecordModal=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 간편녹음 모달뷰에 '손을 떼면 녹음이 완료됩니다.' 안내문구와 음성 아이콘이 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 간편 녹음 아이콘 영역 롱프레스
  - Preconditions: 로그인 계정, 1:1 채팅방, 간편녹음 ON, 마이크 권한 허용
  - Target: VoiceRecordModal
  - Expected State: VoiceRecordModal.Guide=손을 떼면 녹음이 완료됩니다.
  - Evidence: Screenshot, OCR

### 녹음 완료 여부

- **Check Point**: 1초 미만 녹음 시 녹음이 자동 취소되며 바텀시트가 닫힌다.
  - Execution Path: 1:1 채팅방 진입 → 간편 녹음 아이콘 롱프레스 → 1초 미만 녹음 완료
  - Preconditions: 로그인 계정, 1:1 채팅방, 간편녹음 ON, 마이크 권한 허용, 1초 미만 녹음
  - Target: VoiceRecordModal
  - Expected State: VoiceRecordModal=Dismissed
  - Evidence: Screenshot, Video
- **Check Point**: 1초 이상 녹음 완료 시 노란색 음성 UI와 시간이 표기된 모달뷰가 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 간편 녹음 아이콘 롱프레스 → 1초 이상 녹음 완료
  - Preconditions: 로그인 계정, 1:1 채팅방, 간편녹음 ON, 마이크 권한 허용, 1초 이상 녹음
  - Target: VoiceRecordModal
  - Expected State: VoiceRecordModal.State=Recorded
  - Evidence: Screenshot
- **Check Point**: 1초 이상 녹음 완료 후 모달뷰에 새로고침 버튼과 전송 버튼(⬆️)이 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 간편 녹음 아이콘 롱프레스 → 1초 이상 녹음 완료
  - Preconditions: 로그인 계정, 1:1 채팅방, 간편녹음 ON, 마이크 권한 허용, 1초 이상 녹음
  - Target: VoiceRecordModal
  - Expected State: VoiceRecordModal.Buttons=[Refresh,Send]
  - Evidence: Screenshot

### 녹음 새로고침

- **Check Point**: 녹음 새로고침 시 녹음 UI가 회색 영역과 00:00 초기 상태로 리셋된다.
  - Execution Path: 1:1 채팅방 진입 → 간편 녹음 아이콘 롱프레스 → 1초 이상 녹음 → 새로고침
  - Preconditions: 로그인 계정, 1:1 채팅방, 간편녹음 ON, 마이크 권한 허용, 1초 이상 녹음 후 새로고침
  - Target: VoiceRecordModal
  - Expected State: VoiceRecordModal.Timer=00:00
  - Evidence: Screenshot
- **Check Point**: 녹음 새로고침 후 모달뷰에 빨간색 녹화 버튼이 노출된다.
  - Execution Path: 1:1 채팅방 진입 → 간편 녹음 아이콘 롱프레스 → 1초 이상 녹음 → 새로고침
  - Preconditions: 로그인 계정, 1:1 채팅방, 간편녹음 ON, 마이크 권한 허용, 1초 이상 녹음 후 새로고침
  - Target: VoiceRecordModal
  - Expected State: RecordButton=Shown
  - Evidence: Screenshot

# 말풍선 리액션

> 검증 그룹 7 · 항목 18 · 체크포인트 64

## 리액션 진입 및 노출 조건

### 컨텍스트 메뉴 진입점 노출

- **Check Point**: 7일 이내 수발신된 말풍선 롱탭 시 컨텍스트 메뉴에 리액션 퀵바가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 7일 이내 말풍선 롱탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 7일 이내 수발신 말풍선
  - Target: ContextMenu
  - Expected State: ReactionQuickBar=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 7일 이내 수발신된 말풍선 롱탭 시 컨텍스트 메뉴에 리액션 기본 진입점이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 7일 이내 말풍선 롱탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 7일 이내 수발신 말풍선
  - Target: ContextMenu
  - Expected State: ReactionEntryPoint=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 7일 이전 말풍선 롱탭 시 컨텍스트 메뉴에 리액션 메뉴가 노출되지 않는다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 7일 이전 말풍선 롱탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 7일 이전 말풍선
  - Target: ContextMenu
  - Expected State: ReactionMenu=Hidden
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 7일 이전 말풍선 하단 리액션 버블로 추가/해제 시도 시 리액션 불가 안내가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 7일 이전 말풍선 하단 리액션 버블 선택
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 7일 이전 말풍선, 기존 리액션 버블 존재
  - Target: Toast
  - Expected State: ReactionUnavailableGuide=Shown
  - Evidence: Screenshot, OCR

### 기능 제공 범위

- **Check Point**: 채팅방 입력창 잠금이 ON이어도 리액션 기능을 사용할 수 있다.
  - Execution Path: 앱 실행 → 로그인 → 입력창 잠금 ON 채팅방 진입 → 말풍선 롱탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 입력창 잠금=ON
  - Target: ReactionBar
  - Expected State: ReactionFeature=Enabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 채팅방 입력창 잠금이 OFF여도 리액션 기능을 사용할 수 있다.
  - Execution Path: 앱 실행 → 로그인 → 입력창 잠금 OFF 채팅방 진입 → 말풍선 롱탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 입력창 잠금=OFF
  - Target: ReactionBar
  - Expected State: ReactionFeature=Enabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 기능을 제공하는 채팅방의 모든 말풍선에서 리액션을 사용할 수 있다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 임의 말풍선 롱탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 7일 이내 말풍선
  - Target: ReactionBar
  - Expected State: ReactionFeature=Enabled
  - Evidence: Screenshot, ComponentTree

## 리액션 추가·해제 동작

### 진입점 및 리액션 피커

- **Check Point**: 컨텍스트 메뉴 리액션 퀵바에서 리액션을 선택할 수 있다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 리액션 퀵바 노출
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방
  - Target: ReactionQuickBar
  - Expected State: Reaction=Selectable
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 기본 진입점 탭 시 리액션 피커가 진입된다.
  - Execution Path: 채팅방 진입 → 말풍선 롱탭 → 컨텍스트 메뉴 기본 진입점 탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방
  - Target: ReactionPicker
  - Expected State: ReactionPicker=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 말풍선 하단 진입점 탭 시 리액션 피커가 진입된다.
  - Execution Path: 채팅방 진입 → 말풍선 하단 진입점 탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 말풍선 하단 리액션 버블 존재
  - Target: ReactionPicker
  - Expected State: ReactionPicker=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 이모티콘플러스 미구독 시 리액션 피커에 최근 사용·기본 리액션·보유 미니이모티콘 순으로 제공된다.
  - Execution Path: 채팅방 진입 → 말풍선 진입점 탭 → 리액션 피커 진입
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 이모티콘플러스 미구독
  - Target: ReactionPicker
  - Expected State: PickerLayout=RecentThenDefaultThenMiniEmoticon
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 이모티콘플러스 구독 시 리액션 피커에 최근 사용·기본 리액션·카테고리별 리액션탭이 제공된다.
  - Execution Path: 채팅방 진입 → 말풍선 진입점 탭 → 리액션 피커 진입
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 이모티콘플러스 구독
  - Target: ReactionPicker
  - Expected State: PickerLayout=RecentDefaultCategoryTabs
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 리액션 피커 내 움직이는 미니이모티콘은 애니메이션이 동작한다.
  - Execution Path: 채팅방 진입 → 말풍선 진입점 탭 → 리액션 피커 진입
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 움직이는 미니이모티콘 보유
  - Target: ReactionPicker
  - Expected State: MiniEmoticonAnimation=Playing
  - Evidence: Video, Screenshot

### 리액션 추가/해제/카운트

- **Check Point**: 리액션 선택 시 해당 말풍선에 리액션이 적용된다.
  - Execution Path: 채팅방 진입 → 말풍선 진입점 탭 → 리액션 선택
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방
  - Target: ReactionBubble
  - Expected State: Reaction=Applied
  - Evidence: Screenshot, APIResponse
- **Check Point**: 적용된 리액션 버블을 재선택하면 리액션이 해제된다.
  - Execution Path: 채팅방 진입 → 적용된 말풍선 하단 리액션 버블 재선택
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 내가 선택한 리액션 존재
  - Target: ReactionBubble
  - Expected State: Reaction=Removed
  - Evidence: Screenshot, APIResponse
- **Check Point**: 리액션 피커 내에서 선택된 리액션을 재선택하면 반응이 없다.
  - Execution Path: 채팅방 진입 → 리액션 피커 진입 → 선택된 리액션 재선택
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 피커 내 선택된 리액션 존재
  - Target: ReactionPicker
  - Expected State: Reaction=Unchanged
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 선택한 리액션 외 다른 리액션을 선택하면 리액션이 추가 선택된다.
  - Execution Path: 채팅방 진입 → 리액션 피커 진입 → 다른 리액션 선택
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 기존 선택 리액션 존재
  - Target: ReactionBubble
  - Expected State: Reaction=Added
  - Evidence: Screenshot, APIResponse
- **Check Point**: 1개 말풍선에 여러 개의 리액션 아이템을 선택할 수 있다.
  - Execution Path: 채팅방 진입 → 말풍선 진입점 탭 → 복수 리액션 선택
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방
  - Target: ReactionBubble
  - Expected State: SelectedReactionItems=Multiple
  - Evidence: Screenshot, APIResponse
- **Check Point**: 리액션 선택 결과가 말풍선 하단 리액션 버블 카운트에 반영된다.
  - Execution Path: 채팅방 진입 → 말풍선 진입점 탭 → 리액션 선택
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방
  - Target: ReactionBubble
  - Expected State: ReactionCount=Updated
  - Evidence: Screenshot, OCR
- **Check Point**: 선택된 리액션 아이템이 최대 36개까지 전체 노출된다.
  - Execution Path: 채팅방 진입 → 말풍선 하단 리액션 버블 확인
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 다수 리액션 선택 데이터
  - Target: ReactionBubble
  - Expected State: ReactionItemCount=Max36
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 말풍선 하단의 움직이는 미니이모티콘은 애니메이션 4회 반복 후 멈춘다.
  - Execution Path: 채팅방 진입 → 움직이는 미니이모티콘 리액션 버블 확인
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 움직이는 미니이모티콘 리액션 존재
  - Target: ReactionBubble
  - Expected State: Animation=RepeatedThenStopped
  - Evidence: Video

### 실시간 반영

- **Check Point**: 리액션 결과가 플랫폼 간 실시간으로 반영된다.
  - Execution Path: 채팅방 진입 → 리액션 선택 → 타 플랫폼 동일 채팅방 확인
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, Android/iOS/Mac/PC/태블릿 동시 접속
  - Target: ReactionBubble
  - Expected State: Reaction=SyncedRealtime
  - Evidence: Screenshot, APIResponse

## 빠른 리액션(더블탭)

### 더블탭 리액션 동작

- **Check Point**: 말풍선 더블탭 시 '두 번 탭하여 빠른 리액션'에 설정한 리액션 아이템이 적용된다.
  - Execution Path: 설정 > 채팅 > 두 번 탭하여 빠른 리액션 설정 → 채팅방 진입 → 말풍선 더블탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 빠른 리액션 설정값=하트/따봉/체크/웃음/놀람/슬픔 중 하나
  - Target: ReactionBubble
  - Expected State: QuickReaction=Applied
  - Evidence: Screenshot, APIResponse
- **Check Point**: 내가 리액션한 데이터가 있는 말풍선을 더블탭하면 리액션이 취소된다.
  - Execution Path: 채팅방 진입 → 내가 리액션한 말풍선 더블탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 내가 리액션한 데이터 존재
  - Target: ReactionBubble
  - Expected State: QuickReaction=Removed
  - Evidence: Screenshot, APIResponse

### 빠른 리액션 지원 말풍선 타입

- **Check Point**: 텍스트 말풍선에서 더블탭 빠른 리액션을 사용할 수 있다.
  - Execution Path: 채팅방 진입 → 텍스트 말풍선 더블탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 빠른 리액션 설정=사용
  - Target: ReactionBubble
  - Expected State: QuickReaction=Applied
  - Evidence: Screenshot
- **Check Point**: 텍스트+URL 말풍선에서 더블탭 빠른 리액션을 사용할 수 있다.
  - Execution Path: 채팅방 진입 → 텍스트+URL 말풍선 더블탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 빠른 리액션 설정=사용
  - Target: ReactionBubble
  - Expected State: QuickReaction=Applied
  - Evidence: Screenshot
- **Check Point**: 텍스트+이모티콘 말풍선에서 더블탭 빠른 리액션을 사용할 수 있다.
  - Execution Path: 채팅방 진입 → 텍스트+이모티콘 말풍선 더블탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 빠른 리액션 설정=사용
  - Target: ReactionBubble
  - Expected State: QuickReaction=Applied
  - Evidence: Screenshot

### 로우 영역 더블탭 (OS 분기)

- **Check Point**: iOS에서 말풍선 영역 좌우 로우 영역 더블탭으로 빠른 리액션을 사용할 수 있다.
  - Execution Path: 채팅방 진입 → 말풍선 좌우 로우 영역 더블탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, OS=iOS, 빠른 리액션 설정=사용
  - Target: ReactionBubble
  - Expected State: QuickReaction=Applied
  - Evidence: Screenshot
- **Check Point**: Android에서 말풍선 및 하단 댓글·리액션 영역 좌우 로우 영역 더블탭으로 빠른 리액션을 사용할 수 있다.
  - Execution Path: 채팅방 진입 → 말풍선/하단 댓글·리액션 영역 좌우 로우 영역 더블탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, OS=Android, 빠른 리액션 설정=사용
  - Target: ReactionBubble
  - Expected State: QuickReaction=Applied
  - Evidence: Screenshot

## 리액션한 친구 목록

### 친구 목록 화면 노출

- **Check Point**: 말풍선 하단 리액션 버블 롱탭 시 리액션한 친구 목록이 하프뷰로 열린다.
  - Execution Path: 채팅방 진입 → 말풍선 하단 리액션 버블 롱탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 리액션 데이터 존재
  - Target: ReactionUserList
  - Expected State: ReactionUserList=HalfView
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 리액션한 친구 목록을 풀뷰로 확장할 수 있다.
  - Execution Path: 리액션한 친구 목록 하프뷰 → 풀뷰로 확장
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 리액션 데이터 존재
  - Target: ReactionUserList
  - Expected State: ReactionUserList=FullView
  - Evidence: Screenshot
- **Check Point**: 리액션한 친구 목록이 리액션별 탭으로 구성된다.
  - Execution Path: 리액션한 친구 목록 진입
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 복수 종류 리액션 데이터 존재
  - Target: ReactionUserList
  - Expected State: Tabs=PerReaction
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 리액션별 탭 선택 시 탭 간 이동된다.
  - Execution Path: 리액션한 친구 목록 진입 → 다른 리액션 탭 선택
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 복수 종류 리액션 데이터 존재
  - Target: ReactionUserList
  - Expected State: Tab=Switched
  - Evidence: Screenshot
- **Check Point**: 리액션한 친구 목록에서 내 리액션이 최상위에 노출된다.
  - Execution Path: 리액션한 친구 목록 진입
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 내 리액션 데이터 존재
  - Target: ReactionUserList
  - Expected State: MyReaction=Top
  - Evidence: Screenshot
- **Check Point**: 리액션한 친구가 리액션 추가한 순서대로 노출된다.
  - Execution Path: 리액션한 친구 목록 진입
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 복수 친구 리액션 데이터 존재
  - Target: ReactionUserList
  - Expected State: Order=ByAddedTime
  - Evidence: Screenshot

### 친구 정보 노출

- **Check Point**: 각 탭에 리액션별 선택된 갯수가 노출된다.
  - Execution Path: 리액션한 친구 목록 진입
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 리액션 데이터 존재
  - Target: ReactionUserList
  - Expected State: ReactionCount=Displayed
  - Evidence: Screenshot, OCR
- **Check Point**: 친구 정보에 프로필 사진·프로필명·선택한 리액션 아이템이 표시된다.
  - Execution Path: 리액션한 친구 목록 진입
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 리액션 데이터 존재
  - Target: ReactionUserList
  - Expected State: UserInfo=ProfileImageNameReaction
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 친구 정보에 나 뱃지, 팀채팅 방장, 오픈채팅 방장·부방장·오픈프로필 뱃지가 노출된다.
  - Execution Path: 리액션한 친구 목록 진입
  - Preconditions: 로그인 계정, 그룹/팀채팅/오픈채팅, 뱃지 대상 친구 리액션 데이터 존재
  - Target: ReactionUserList
  - Expected State: Badge=Shown
  - Evidence: Screenshot
- **Check Point**: 친구 프로필이 멀티프로필 기준으로 노출된다.
  - Execution Path: 리액션한 친구 목록 진입
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 멀티프로필 설정 친구 리액션 데이터 존재
  - Target: ReactionUserList
  - Expected State: Profile=MultiProfile
  - Evidence: Screenshot
- **Check Point**: 친구 탭 시 해당 친구 프로필 화면으로 랜딩된다.
  - Execution Path: 리액션한 친구 목록 진입 → 친구 탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 리액션 데이터 존재
  - Target: ProfileScreen
  - Expected State: ProfileScreen=Shown
  - Evidence: Screenshot

### 네트워크 예외

- **Check Point**: 네트워크 단절 시 '일시적인 오류로 리액션한 친구 목록을 불러올 수 없습니다.' 안내 문구가 노출된다.
  - Execution Path: 비행기 모드 설정 → 채팅방 진입 → 말풍선 하단 리액션 버블 롱탭
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 네트워크 단절(비행기 모드), 리액션 데이터 존재
  - Target: Toast
  - Expected State: ErrorGuide=Shown
  - Evidence: Screenshot, OCR

## 채팅방 서비스 연동 및 데이터 노출

### 삭제·가리기 연동

- **Check Point**: 모두에게서 삭제 시 리액션 데이터가 함께 삭제된다.
  - Execution Path: 채팅방 진입 → 리액션 있는 말풍선 롱탭 → 모두에게서 삭제
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 리액션 데이터 존재
  - Target: ReactionBubble
  - Expected State: ReactionData=Deleted
  - Evidence: Screenshot, APIResponse
- **Check Point**: 나에게서 삭제 시 내 말풍선의 리액션 데이터가 함께 삭제된다.
  - Execution Path: 채팅방 진입 → 내 말풍선 롱탭 → 나에게서 삭제
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 내 말풍선 리액션 데이터 존재
  - Target: ReactionBubble
  - Expected State: ReactionData=Deleted
  - Evidence: Screenshot, APIResponse
- **Check Point**: 나에게서 삭제 시 대화상대 말풍선의 리액션 데이터는 남아있다.
  - Execution Path: 채팅방 진입 → 내 말풍선 나에게서 삭제 → 대화상대 말풍선 확인
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 대화상대 말풍선 리액션 데이터 존재
  - Target: ReactionBubble
  - Expected State: ReactionData=Retained
  - Evidence: Screenshot, APIResponse

### 리액션 데이터 노출 화면

- **Check Point**: 댓글 상세 화면에 리액션 데이터가 노출된다.
  - Execution Path: 채팅방 진입 → 댓글 상세 화면 진입
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 리액션 데이터 존재
  - Target: CommentDetail
  - Expected State: ReactionData=Shown
  - Evidence: Screenshot
- **Check Point**: 캡쳐 화면에 리액션 데이터가 노출된다.
  - Execution Path: 채팅방 진입 → 캡쳐 실행
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 리액션 데이터 존재
  - Target: CaptureView
  - Expected State: ReactionData=Shown
  - Evidence: Screenshot
- **Check Point**: 말풍선 신고 화면에 리액션 데이터가 노출된다.
  - Execution Path: 채팅방 진입 → 말풍선 신고 화면 진입
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 리액션 데이터 존재, 팀채팅 제외
  - Target: ReportView
  - Expected State: ReactionData=Shown
  - Evidence: Screenshot
- **Check Point**: 채팅방 검색(타임머신) 화면에 리액션 데이터가 노출된다.
  - Execution Path: 채팅방 진입 → 채팅방 검색(타임머신) 진입
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 리액션 데이터 존재
  - Target: SearchView
  - Expected State: ReactionData=Shown
  - Evidence: Screenshot
- **Check Point**: 대화내보내기 시 리액션 데이터가 노출되지 않는다.
  - Execution Path: 채팅방 진입 → 대화내보내기 실행
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 리액션 데이터 존재
  - Target: ExportFile
  - Expected State: ReactionData=NotExported
  - Evidence: Log, OCR

## 복원 처리

### 복원된 리액션 데이터 노출

- **Check Point**: 챗로그 백업 후 재설치·복원 완료 시 복원된 챗로그의 리액션 데이터가 모두 노출된다.
  - Execution Path: 챗로그 백업 → 톡 재설치 → 복원 완료 → 채팅방 진입
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 복원된 말풍선 존재, 서버에 리액션 데이터 존재
  - Target: ReactionBubble
  - Expected State: ReactionData=Shown
  - Evidence: Screenshot, APIResponse
- **Check Point**: 유실선 대화 불러오기 시 리액션 데이터가 노출된다.
  - Execution Path: 채팅방 진입 → 유실선 대화 불러오기
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 유실선 존재, 서버에 리액션 데이터 존재
  - Target: ReactionBubble
  - Expected State: ReactionData=Shown
  - Evidence: Screenshot, APIResponse
- **Check Point**: 팀채팅에서 스크롤업으로 이전 대화 불러오기 시 리액션 데이터가 노출된다.
  - Execution Path: 팀채팅방 진입 → 스크롤업 → 이전 대화 불러오기
  - Preconditions: 로그인 계정, 팀채팅방, 서버에 리액션 데이터 존재
  - Target: ReactionBubble
  - Expected State: ReactionData=Shown
  - Evidence: Screenshot, APIResponse

### 리액션 아이템 복원 실패 처리

- **Check Point**: 리액션 아이템 복원 실패 시에도 말풍선은 정상 노출되고 기능을 사용할 수 있다.
  - Execution Path: 챗로그 백업 → 톡 재설치 → 복원 완료 → 채팅방 말풍선 확인
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 리액션 아이템 복원 실패
  - Target: ReactionBubble
  - Expected State: Bubble=Normal, ReactionFeature=Enabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 복원 실패 말풍선에 리액션 선택 시 해당 말풍선 데이터가 복원되고 신규 데이터가 적용된다.
  - Execution Path: 복원 실패 말풍선 진입점 탭 → 리액션 선택
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 리액션 아이템 복원 실패
  - Target: ReactionBubble
  - Expected State: ReactionData=RestoredAndApplied
  - Evidence: Screenshot, APIResponse
- **Check Point**: 복원 실패 채팅방을 나갔다 재입장하면 전체 말풍선 리액션 아이템 데이터가 복원된다.
  - Execution Path: 복원 실패 채팅방 나가기 → 재입장
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 리액션 아이템 복원 실패, 복원 실패 사유 없음
  - Target: ReactionBubble
  - Expected State: ReactionData=Restored
  - Evidence: Screenshot, APIResponse
- **Check Point**: 복원 실패 사유가 존재하면 재입장 시에도 리액션 데이터가 복원되지 않는다.
  - Execution Path: 복원 실패 채팅방 나가기 → 재입장
  - Preconditions: 로그인 계정, 1:1 또는 그룹 채팅방, 리액션 아이템 복원 실패, 복원 실패 사유 존재
  - Target: ReactionBubble
  - Expected State: ReactionData=NotRestored
  - Evidence: Screenshot, APIResponse

## 예외 처리 (기능 미제공 조건)

### 차단 관계에 따른 제공 여부

- **Check Point**: 일반 그룹채팅에서 내가 차단한 사용자의 말풍선은 리액션 메뉴가 미제공된다.
  - Execution Path: 그룹 채팅방 진입 → 내가 차단한 사용자 말풍선 롱탭
  - Preconditions: 로그인 계정, 일반 그룹채팅, 상대를 내가 차단한 상태
  - Target: ContextMenu
  - Expected State: ReactionMenu=Hidden
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 일반 그룹채팅에서 나를 차단한 사용자의 말풍선은 리액션 메뉴가 제공된다.
  - Execution Path: 그룹 채팅방 진입 → 나를 차단한 사용자 말풍선 롱탭
  - Preconditions: 로그인 계정, 일반 그룹채팅, 상대에게 내가 차단당한 상태
  - Target: ContextMenu
  - Expected State: ReactionMenu=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 일반 1:1 채팅에서는 리액션 기능이 비활성화된다.
  - Execution Path: 1:1 채팅방 진입 → 차단 상대 말풍선 롱탭
  - Preconditions: 로그인 계정, 일반 1:1 채팅, 차단 관계
  - Target: ContextMenu
  - Expected State: ReactionMenu=Disabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 팀채팅에서는 차단과 무관하게 리액션을 사용할 수 있다.
  - Execution Path: 팀채팅방 진입 → 말풍선 롱탭
  - Preconditions: 로그인 계정, 팀채팅방, 차단 관계
  - Target: ContextMenu
  - Expected State: ReactionMenu=Shown
  - Evidence: Screenshot, ComponentTree

### 입력창 차단 상태 채팅방

- **Check Point**: 차단 친구와의 채팅방에서 말풍선 롱탭 시 컨텍스트 메뉴에 리액션 메뉴가 미노출된다.
  - Execution Path: 차단 친구 채팅방 진입 → 말풍선 롱탭
  - Preconditions: 로그인 계정, 입력창 차단 상태, 차단 친구와의 채팅방
  - Target: ContextMenu
  - Expected State: ReactionMenu=Hidden
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 인증 뺏긴 친구와의 채팅방에서 말풍선 롱탭 시 컨텍스트 메뉴에 리액션 메뉴가 미노출된다.
  - Execution Path: 인증 뺏긴 친구 채팅방 진입 → 말풍선 롱탭
  - Preconditions: 로그인 계정, 입력창 차단 상태, 인증 뺏긴 친구와의 채팅방
  - Target: ContextMenu
  - Expected State: ReactionMenu=Hidden
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 탈퇴한 친구와의 채팅방에서 말풍선 롱탭 시 컨텍스트 메뉴에 리액션 메뉴가 미노출된다.
  - Execution Path: 탈퇴한 친구 채팅방 진입 → 말풍선 롱탭
  - Preconditions: 로그인 계정, 입력창 차단 상태, 탈퇴한 친구와의 채팅방
  - Target: ContextMenu
  - Expected State: ReactionMenu=Hidden
  - Evidence: Screenshot, ComponentTree

### 나와의 채팅방

- **Check Point**: 나와의 채팅방에서 말풍선 롱탭 시 컨텍스트 메뉴에 리액션 메뉴가 미노출된다.
  - Execution Path: 나와의 채팅방 진입 → 말풍선 롱탭
  - Preconditions: 로그인 계정, 나와의 채팅방
  - Target: ContextMenu
  - Expected State: ReactionMenu=Hidden
  - Evidence: Screenshot, ComponentTree

# 예외·특수케이스

> 검증 그룹 5 · 항목 18 · 체크포인트 61

## 프리채팅방

### 채팅방 개설 및 최초 발송

- **Check Point**: 채팅방 신규 생성 후 최초 메시지가 정상 발송된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 신규 생성 → 메시지 입력 → 전송
  - Preconditions: 로그인 계정, 프리채팅방 개설자
  - Target: Message
  - Expected State: MessageSent
  - Evidence: Screenshot, APIResponse

### 프리채팅방 알림

- **Check Point**: 개설자가 최초 메시지 발송 시 참여자에게 프리채팅방 알림이 수신된다.
  - Execution Path: 개설자: 채팅방 신규 생성 → 개설자: 최초 메시지 발송
  - Preconditions: 참여자 알림 ON 상태, 프리채팅방 참여자 계정
  - Target: Notification
  - Expected State: Notification=Received
  - Evidence: Screenshot, Log
- **Check Point**: 프리채팅방 알림을 탭하면 해당 채팅방으로 이동된다.
  - Execution Path: 알림 수신 → 알림 탭
  - Preconditions: 참여자 알림 ON 상태, 프리채팅방 참여자 계정
  - Target: ChatRoom
  - Expected State: ChatRoom=Opened
  - Evidence: Screenshot

### 웰컴메시지

- **Check Point**: 프리채팅방 진입 시 웰컴메시지가 랜덤으로 노출된다.
  - Execution Path: 프리채팅방 진입
  - Preconditions: 1:1 일반채팅방, 이모티콘 구독 여부 무관
  - Target: WelcomeMessage
  - Expected State: WelcomeMessage=Shown
  - Evidence: Screenshot
- **Check Point**: 1:1 일반채팅방 외 채팅방에서는 웰컴메시지가 노출되지 않는다.
  - Execution Path: 프리채팅방 진입
  - Preconditions: 그룹/오픈/나와의채팅 등 1:1 일반채팅방 외
  - Target: WelcomeMessage
  - Expected State: WelcomeMessage=Hidden
  - Evidence: Screenshot
- **Check Point**: 웰컴메시지 탭 시 이모티콘이 채팅방으로 발송된다.
  - Execution Path: 프리채팅방 진입 → 웰컴메시지 탭
  - Preconditions: 1:1 일반채팅방
  - Target: Emoticon
  - Expected State: EmoticonSent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 채팅방 재진입 시 웰컴메시지가 노출되지 않는다.
  - Execution Path: 웰컴메시지 노출 후 채팅방 이탈 → 채팅방 재진입
  - Preconditions: 1:1 일반채팅방, 웰컴메시지 최초 노출 이력 있음
  - Target: WelcomeMessage
  - Expected State: WelcomeMessage=Hidden
  - Evidence: Screenshot

## 스팸뷰(친구 아닌 사용자)

### 스팸뷰 노출

- **Check Point**: 친구로 등록되지 않은 사용자로부터 메시지 수신 시 채팅방 상단에 스팸뷰가 표시된다.
  - Execution Path: A(친구 아님)로부터 메시지 수신 → 채팅방 진입
  - Preconditions: A와 친구 아님
  - Target: SpamView
  - Expected State: SpamView=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 스팸뷰에 [추가]·[차단]·[신고] 버튼이 노출된다.
  - Execution Path: 스팸뷰 노출
  - Preconditions: A와 친구 아님
  - Target: SpamView
  - Expected State: ActionButtons=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 스팸뷰에 '친구로 등록되지 않은 사용자입니다. 금전 요구 등으로 인한 피해를 입지 않도록 주의해 주세요.' 안내 문구가 노출된다.
  - Execution Path: 스팸뷰 노출
  - Preconditions: A와 친구 아님
  - Target: SpamView
  - Expected State: GuideText=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 스팸뷰에 주의사항 보기 링크가 노출된다.
  - Execution Path: 스팸뷰 노출
  - Preconditions: A와 친구 아님
  - Target: SpamView
  - Expected State: GuideLink=Shown
  - Evidence: Screenshot
- **Check Point**: [차단] 버튼은 1:1 채팅방에서만 노출된다.
  - Execution Path: 스팸뷰 노출
  - Preconditions: A와 친구 아님, 1:1 채팅방
  - Target: SpamView
  - Expected State: BlockButton=Shown
  - Evidence: Screenshot, ComponentTree

### 주의사항 보기

- **Check Point**: 주의사항 보기 링크 탭 시 카카오톡 안녕가이드 피싱 주의 페이지로 이동된다.
  - Execution Path: 스팸뷰 노출 → 주의사항 보기 링크 탭
  - Preconditions: A와 친구 아님, 네트워크 연결
  - Target: WebView
  - Expected State: Page=PhishingGuide
  - Evidence: Screenshot, Log

### 친구 추가

- **Check Point**: [추가] 버튼 탭 시 스팸뷰가 사라진다.
  - Execution Path: 스팸뷰 노출 → [추가] 버튼 탭
  - Preconditions: A와 친구 아님
  - Target: SpamView
  - Expected State: SpamView=Hidden
  - Evidence: Screenshot
- **Check Point**: [추가] 버튼 탭 시 A가 친구로 추가된다.
  - Execution Path: 스팸뷰 노출 → [추가] 버튼 탭
  - Preconditions: A와 친구 아님
  - Target: Friend
  - Expected State: Friend=Added
  - Evidence: APIResponse, DB

### 차단

- **Check Point**: [차단] 버튼 탭 시 메시지 차단 / 메시지 차단·프로필 비공개 옵션이 담긴 차단 레이어가 노출된다.
  - Execution Path: 스팸뷰 노출 → [차단] 버튼 탭
  - Preconditions: A와 친구 아님, 1:1 채팅방
  - Target: Alert
  - Expected State: BlockLayer=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 차단 진행 시 차단 친구 목록에 A가 추가된다.
  - Execution Path: 차단 레이어 노출 → [메시지 차단] 버튼 탭
  - Preconditions: A와 친구 아님, 1:1 채팅방
  - Target: BlockedList
  - Expected State: BlockedList.Contains=A
  - Evidence: APIResponse, DB
- **Check Point**: 차단 진행 시 [차단] 버튼이 [차단해제]로 변경된다.
  - Execution Path: 차단 레이어 노출 → [메시지 차단] 버튼 탭
  - Preconditions: A와 친구 아님, 1:1 채팅방
  - Target: BlockButton
  - Expected State: BlockButton=Unblock
  - Evidence: Screenshot
- **Check Point**: 차단 진행 시 채팅 입력필드가 비활성화된다.
  - Execution Path: 차단 레이어 노출 → [메시지 차단] 버튼 탭
  - Preconditions: A와 친구 아님, 1:1 채팅방
  - Target: MessageInput
  - Expected State: MessageInput=Disabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 차단 진행 시 '차단친구와는 대화할 수 없습니다.' 안내 문구가 노출된다.
  - Execution Path: 차단 레이어 노출 → [메시지 차단] 버튼 탭
  - Preconditions: A와 친구 아님, 1:1 채팅방, iOS 또는 Android
  - Target: MessageInput
  - Expected State: GuideText=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: [메시지 차단·프로필 비공개]로 차단 시 A 계정에서 조회하면 기본 프로필로 노출된다.
  - Execution Path: 차단 레이어 노출 → [메시지 차단, 프로필 비공개] 버튼 탭 → A 계정에서 프로필 조회
  - Preconditions: A와 친구 아님, 1:1 채팅방
  - Target: ProfileImage
  - Expected State: Profile=Default
  - Evidence: Screenshot
- **Check Point**: 차단 상태에서 A가 메시지 전송 시 메시지가 수신되지 않는다.
  - Execution Path: A 차단 완료 → A로부터 메시지 발송
  - Preconditions: A 차단 상태
  - Target: Message
  - Expected State: Message=NotReceived
  - Evidence: APIResponse, Log
- **Check Point**: 차단 상태에서 A 프로필 탭 시 A의 프로필과 배경화면이 노출된다.
  - Execution Path: A 차단 완료 → A 프로필 탭
  - Preconditions: A 차단 상태
  - Target: ProfileImage
  - Expected State: Profile=Shown
  - Evidence: Screenshot
- **Check Point**: 차단 상태에서 A 프로필 진입 시 [차단해제] 버튼이 노출된다.
  - Execution Path: A 차단 완료 → A 프로필 탭
  - Preconditions: A 차단 상태
  - Target: ProfileView
  - Expected State: UnblockButton=Shown
  - Evidence: Screenshot, ComponentTree

### 차단 해제

- **Check Point**: [차단해제] 버튼 탭 시 차단 친구 목록에서 A가 삭제된다.
  - Execution Path: A 차단 상태 → [차단해제] 버튼 탭
  - Preconditions: A 차단 상태
  - Target: BlockedList
  - Expected State: BlockedList.NotContains=A
  - Evidence: APIResponse, DB
- **Check Point**: 차단 해제 시 [차단해제] 버튼이 [차단]으로 변경된다.
  - Execution Path: A 차단 상태 → [차단해제] 버튼 탭
  - Preconditions: A 차단 상태
  - Target: BlockButton
  - Expected State: BlockButton=Block
  - Evidence: Screenshot
- **Check Point**: 차단 해제 시 채팅 입력필드가 다시 활성화된다.
  - Execution Path: A 차단 상태 → [차단해제] 버튼 탭
  - Preconditions: A 차단 상태
  - Target: MessageInput
  - Expected State: MessageInput=Enabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 차단 해제 후 메시지 송·수신이 가능하다.
  - Execution Path: A 차단 해제 → 메시지 전송
  - Preconditions: A 차단 해제 상태
  - Target: Message
  - Expected State: MessageSent
  - Evidence: APIResponse, Screenshot

### 신고

- **Check Point**: [신고] 버튼 탭 시 메시지 신고 화면이 노출된다.
  - Execution Path: 스팸뷰 노출 → [신고] 버튼 탭
  - Preconditions: A와 친구 아님
  - Target: ReportView
  - Expected State: ReportView=Shown
  - Evidence: Screenshot
- **Check Point**: 신고할 상대방 말풍선 선택 후 [신고하기] 버튼 탭 시 신고하기 페이지가 노출된다.
  - Execution Path: 메시지 신고 화면 진입 → 상대방 말풍선 선택 → [신고하기] 버튼 탭
  - Preconditions: A와 친구 아님
  - Target: ReportView
  - Expected State: ReportPage=Shown
  - Evidence: Screenshot
- **Check Point**: 신고 화면 내 가이드라인 링크 탭 시 카카오톡 안녕가이드 운영정책 페이지로 이동된다.
  - Execution Path: 신고하기 페이지 진입 → 가이드라인 링크 탭
  - Preconditions: A와 친구 아님, 네트워크 연결
  - Target: WebView
  - Expected State: Page=OperationPolicy
  - Evidence: Screenshot, Log
- **Check Point**: 신고하고 나가기 체크 후 [완료] 버튼 탭 시 신고 완료 얼럿이 노출된다.
  - Execution Path: 신고하기 페이지 진입 → 신고하고 나가기 체크 → [완료] 버튼 탭
  - Preconditions: A와 친구 아님
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot
- **Check Point**: 신고 완료 얼럿 [확인] 버튼 탭 시 채팅방이 나가진다.
  - Execution Path: 신고 완료 얼럿 노출 → [확인] 버튼 탭
  - Preconditions: A와 친구 아님, 신고하고 나가기 체크됨
  - Target: ChatRoom
  - Expected State: ChatRoom=Exited
  - Evidence: Screenshot
- **Check Point**: 신고 완료 후 차단 친구 목록에 A가 추가된다.
  - Execution Path: 신고 완료 얼럿 노출 → [확인] 버튼 탭
  - Preconditions: A와 친구 아님, 신고하고 나가기 체크됨
  - Target: BlockedList
  - Expected State: BlockedList.Contains=A
  - Evidence: APIResponse, DB

## 해외 사용자 스팸뷰

### 해외 사용자 배너

- **Check Point**: 친구 미등록 해외 번호 유저로부터 메시지 수신 시 채팅방 상단에 안내 배너가 노출된다.
  - Execution Path: 해외 번호 유저로부터 메시지 수신 → 채팅방 진입
  - Preconditions: 상대방과 친구 아님, 상대방 해외 번호 사용자
  - Target: Banner
  - Expected State: Banner=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 해외 사용자 프로필 이미지에 글로브 시그널이 노출된다.
  - Execution Path: 해외 번호 유저로부터 메시지 수신 → 채팅방 진입
  - Preconditions: 상대방과 친구 아님, 상대방 해외 번호 사용자
  - Target: ProfileImage
  - Expected State: GlobeSignal=Shown
  - Evidence: Screenshot

### 1:1 채팅방 스팸뷰

- **Check Point**: '친구로 등록되지 않은 사용자입니다. 금전 요구 등으로 인한 피해를 입지 않도록 주의해 주세요.' 스팸뷰 문구가 노출된다.
  - Execution Path: 해외 사용자 1:1 채팅방 진입
  - Preconditions: 친구 아닌 사용자로부터 메시지를 받은 해외 사용자, 1:1 일반채팅 또는 비밀채팅
  - Target: SpamView
  - Expected State: GuideText=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 주의사항 보기 링크 선택 시 kakaotalk 안전 도구 및 가이드라인 페이지로 랜딩된다.
  - Execution Path: 스팸뷰 노출 → 주의사항 보기 링크 선택
  - Preconditions: 친구 아닌 사용자로부터 메시지를 받은 해외 사용자, 1:1 일반채팅 또는 비밀채팅, 네트워크 연결
  - Target: WebView
  - Expected State: Page=TalkSafetyGuide
  - Evidence: Screenshot, Log
- **Check Point**: 채팅방 상단 [신고] > [신고하기] 진행 시 신고 접수가 정상적으로 이루어진다.
  - Execution Path: 스팸뷰 노출 → [신고] 선택 → 사유 선택 → [신고하기] 버튼 탭
  - Preconditions: 친구 아닌 사용자로부터 메시지를 받은 해외 사용자, 1:1 일반채팅 또는 비밀채팅
  - Target: ReportView
  - Expected State: Report=Submitted
  - Evidence: APIResponse, Screenshot

### 그룹 채팅방 스팸뷰

- **Check Point**: '친구로 등록되지 않은 사용자로부터 초대되었습니다. 금전 요구 등으로 인한 피해를 입지 않도록 주의해 주세요.' 스팸뷰 문구가 노출된다.
  - Execution Path: 해외 사용자 그룹 채팅방 진입
  - Preconditions: 친구 아닌 사용자로부터 메시지를 받은 해외 사용자, 그룹 일반채팅/비밀채팅/팀채팅
  - Target: SpamView
  - Expected State: GuideText=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: [주의사항 보기] 링크 선택 시 kakaotalk 안전 도구 및 가이드라인 페이지로 랜딩된다.
  - Execution Path: 스팸뷰 노출 → [주의사항 보기] 링크 선택
  - Preconditions: 친구 아닌 사용자로부터 메시지를 받은 해외 사용자, 그룹 일반채팅/비밀채팅/팀채팅, 네트워크 연결
  - Target: WebView
  - Expected State: Page=TalkSafetyGuide
  - Evidence: Screenshot, Log
- **Check Point**: [신고하기] 버튼 선택 후 사유 선택 시 신고 접수가 정상적으로 이루어진다.
  - Execution Path: 스팸뷰 노출 → [신고하기] 버튼 선택 → 사유 선택
  - Preconditions: 친구 아닌 사용자로부터 메시지를 받은 해외 사용자, 그룹 일반채팅/비밀채팅/팀채팅
  - Target: ReportView
  - Expected State: Report=Submitted
  - Evidence: APIResponse, Screenshot

## 플러스 메뉴

### 플러스 메뉴 인터랙션

- **Check Point**: 플러스메뉴 아이콘 탭 시 메뉴 탐색 인터랙션이 상하 스크롤 방식으로 동작한다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 아이콘 탭
  - Preconditions: 로그인 계정
  - Target: PlusMenu
  - Expected State: Scroll=Vertical
  - Evidence: Screenshot, Video
- **Check Point**: 플러스메뉴가 버티컬 서비스 아이콘으로 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 아이콘 탭
  - Preconditions: 로그인 계정
  - Target: PlusMenu
  - Expected State: Icon=Vertical
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 채팅방 종류별 정의된 순서로 배치되며 화면 사이즈에 맞춰 배열 개수가 달라진다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 아이콘 탭
  - Preconditions: 로그인 계정
  - Target: PlusMenu
  - Expected State: Layout=OrderedByRoomType
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 레이블이 최대 2줄까지 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 큰 폰트 설정
  - Target: PlusMenu
  - Expected State: Label.MaxLines=2
  - Evidence: Screenshot

### 간편녹음 버튼

- **Check Point**: 입력창 내 간편녹음 버튼이 노출된다.
  - Execution Path: 1:1 대화방 진입 → 입력창 확인
  - Preconditions: 1:1 대화방, 간편녹음 사용 On
  - Target: Toolbar
  - Expected State: QuickRecordButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 키보드 노출 시 간편녹음 버튼이 숨겨진다.
  - Execution Path: 1:1 대화방 진입 → 입력창 선택하여 키보드 노출
  - Preconditions: 1:1 대화방, 간편녹음 사용 On
  - Target: Toolbar
  - Expected State: QuickRecordButton=Hidden
  - Evidence: Screenshot

### 채팅방 종류별 플러스메뉴 구성

- **Check Point**: 1:1 및 그룹 채팅방 플러스메뉴가 사진·카메라·통화·지도·파일·톡클라우드·연락처·음성메시지·예약메시지·캡처·일정 순으로 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 진입
  - Preconditions: 1:1 대화방 또는 그룹채팅방
  - Target: PlusMenu
  - Expected State: MenuOrder=사진,카메라,통화,지도,파일,톡클라우드,연락처,음성메시지,예약메시지,캡처,일정
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 나와의 채팅방 플러스메뉴가 사진·카메라·지도·공개투표·파일·톡클라우드·연락처·음성메시지·예약메시지·캡처·일정 순으로 노출된다.
  - Execution Path: 나와의 채팅방 진입 → 플러스메뉴 진입
  - Preconditions: 나와의 채팅방
  - Target: PlusMenu
  - Expected State: MenuOrder=사진,카메라,지도,공개투표,파일,톡클라우드,연락처,음성메시지,예약메시지,캡처,일정
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 채팅 가능 채널방 플러스메뉴가 사진·카메라·파일·톡클라우드·음성메시지·캡처 순으로 노출된다.
  - Execution Path: 채널방 진입 → 플러스메뉴 진입
  - Preconditions: 채팅 가능 채널방
  - Target: PlusMenu
  - Expected State: MenuOrder=사진,카메라,파일,톡클라우드,음성메시지,캡처
  - Evidence: Screenshot, ComponentTree

## 캡처 옵션

### 캡처 옵션 진입

- **Check Point**: [캡처 옵션] 버튼 탭 시 '캡처 옵션' 타이틀의 프로필 및 배경 선택 옵션이 노출된다.
  - Execution Path: 캡처 영역 진입 → [캡처 옵션] 버튼 탭
  - Preconditions: 캡처 기능 진입 상태
  - Target: CaptureOption
  - Expected State: CaptureOption=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 프로필 옵션으로 변경 안 함(default)·모자이크·카카오프렌즈가 노출된다.
  - Execution Path: 캡처 옵션 노출
  - Preconditions: 캡처 기능 진입 상태
  - Target: CaptureOption
  - Expected State: ProfileOptions=Shown
  - Evidence: Screenshot
- **Check Point**: 배경 옵션으로 변경 안 함(default)·기본 배경이 노출된다.
  - Execution Path: 캡처 옵션 노출
  - Preconditions: 캡처 기능 진입 상태
  - Target: CaptureOption
  - Expected State: BackgroundOptions=Shown
  - Evidence: Screenshot

### 캡처 영역 선택

- **Check Point**: 캡처 시작 말풍선 선택 시 상단 가이드 문구가 '캡처 영역을 지정해주세요'로 변경된다.
  - Execution Path: 캡처 영역 진입 → 캡처 시작 말풍선 선택
  - Preconditions: 캡처 기능 진입 상태
  - Target: CaptureGuideText
  - Expected State: GuideText=캡처 영역을 지정해주세요
  - Evidence: Screenshot, OCR
- **Check Point**: 캡처 시작 말풍선 선택 시 선택 해제·저장·전달 버튼이 활성화된다.
  - Execution Path: 캡처 영역 진입 → 캡처 시작 말풍선 선택
  - Preconditions: 캡처 기능 진입 상태
  - Target: Toolbar
  - Expected State: ActionButtons=Enabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 캡처 끝 영역 선택 시 상단 가이드 문구가 '저장 또는 전달 버튼을 선택해주세요'로 변경된다.
  - Execution Path: 캡처 시작 말풍선 선택 → 캡처 끝 영역 선택
  - Preconditions: 캡처 기능 진입 상태
  - Target: CaptureGuideText
  - Expected State: GuideText=저장 또는 전달 버튼을 선택해주세요
  - Evidence: Screenshot, OCR

### 캡처 옵션 적용

- **Check Point**: 프로필 모자이크 선택 시 프로필이 모자이크 처리된다.
  - Execution Path: 캡처 옵션 노출 → 프로필 모자이크 선택 → 결과 확인
  - Preconditions: 캡처 기능 진입 상태
  - Target: ProfileImage
  - Expected State: Profile=Mosaic
  - Evidence: Screenshot
- **Check Point**: 프로필 모자이크 선택 시 이름이 카카오프렌즈 랜덤 이름으로 변경된다.
  - Execution Path: 캡처 옵션 노출 → 프로필 모자이크 선택 → 결과 확인
  - Preconditions: 캡처 기능 진입 상태
  - Target: ProfileName
  - Expected State: Name=RandomFriends
  - Evidence: Screenshot, OCR
- **Check Point**: 프로필 카카오프렌즈 선택 시 프로필이 카카오프렌즈 이미지 및 랜덤 이름으로 변경된다.
  - Execution Path: 캡처 옵션 노출 → 프로필 카카오프렌즈 선택 → 결과 확인
  - Preconditions: 캡처 기능 진입 상태
  - Target: ProfileImage
  - Expected State: Profile=KakaoFriends
  - Evidence: Screenshot, OCR
- **Check Point**: 배경 기본 배경 선택 시 채팅방 기본 배경(blue)으로 변경된다.
  - Execution Path: 캡처 옵션 노출 → 배경 기본 배경 선택 → 결과 확인
  - Preconditions: 캡처 기능 진입 상태
  - Target: Background
  - Expected State: Background=DefaultBlue
  - Evidence: Screenshot

# 대화상대·멤버 관리

> 검증 그룹 5 · 항목 18 · 체크포인트 55

## 대화상대 프로필 조회

### 프로필 진입

- **Check Point**: 상대방 메시지 좌측 프로필 사진 탭 시 상대방 프로필 상세가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 상대방 메시지 좌측 프로필 사진 탭
  - Preconditions: 로그인 계정, 대화상대와의 채팅방(1:1/그룹)
  - Target: ProfileSheet
  - Expected State: ProfileSheet=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 대화상대 목록에서 내 프로필 탭 시 내 프로필 상세가 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 대화상대 목록 진입 → 내 프로필 탭
  - Preconditions: 로그인 계정
  - Target: ProfileSheet
  - Expected State: ProfileSheet=Shown
  - Evidence: Screenshot, ComponentTree

### 내 프로필 액션 버튼

- **Check Point**: 내 프로필 상세에 [나와의 채팅] 버튼이 노출된다.
  - Execution Path: 대화상대 목록 진입 → 내 프로필 탭
  - Preconditions: 로그인 계정
  - Target: ProfileSheet
  - Expected State: Button.나와의채팅=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 내 프로필 상세에 [프로필 편집] 버튼이 노출된다.
  - Execution Path: 대화상대 목록 진입 → 내 프로필 탭
  - Preconditions: 로그인 계정
  - Target: ProfileSheet
  - Expected State: Button.프로필편집=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 카카오스토리 계정 연동 시 내 프로필 상세에 [카카오스토리] 버튼이 노출된다.
  - Execution Path: 대화상대 목록 진입 → 내 프로필 탭
  - Preconditions: 로그인 계정, 카카오스토리 계정 연동
  - Target: ProfileSheet
  - Expected State: Button.카카오스토리=Shown
  - Evidence: Screenshot, ComponentTree

### 친구 프로필 액션 버튼

- **Check Point**: 친구이고 전화번호가 저장된 경우 프로필 상세에 [통화하기] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 상대방 프로필 사진 탭
  - Preconditions: 로그인 계정, 친구 관계, 상대 전화번호 주소록 저장됨
  - Target: ProfileSheet
  - Expected State: Button.통화하기=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 친구이고 전화번호가 저장되지 않은 경우 프로필 상세에 [보이스톡] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 상대방 프로필 사진 탭
  - Preconditions: 로그인 계정, 친구 관계, 상대 전화번호 주소록 미저장
  - Target: ProfileSheet
  - Expected State: Button.보이스톡=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 친구 프로필 상세에 [페이스톡] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 상대방 프로필 사진 탭
  - Preconditions: 로그인 계정, 친구 관계
  - Target: ProfileSheet
  - Expected State: Button.페이스톡=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 상대가 등록한 게시물이 있는 경우 친구 프로필 상세에 [펑] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 상대방 프로필 사진 탭
  - Preconditions: 로그인 계정, 친구 관계, 상대 등록 게시물 존재
  - Target: ProfileSheet
  - Expected State: Button.펑=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 카카오스토리 계정 연동 시 친구 프로필 상세에 [카카오스토리] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 상대방 프로필 사진 탭
  - Preconditions: 로그인 계정, 친구 관계, 카카오스토리 계정 연동
  - Target: ProfileSheet
  - Expected State: Button.카카오스토리=Shown
  - Evidence: Screenshot, ComponentTree

### 1:1 채팅 버튼 노출 조건

- **Check Point**: 그룹채팅방에서 친구 프로필 탭 시 [1:1 채팅] 버튼이 노출된다.
  - Execution Path: 그룹채팅방 진입 → 친구 프로필 탭
  - Preconditions: 로그인 계정, 친구 관계, 그룹채팅방
  - Target: ProfileSheet
  - Expected State: Button.1대1채팅=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 친구 프로필에서 [1:1 채팅] 버튼 탭 시 해당 친구와의 1:1 채팅방으로 이동된다.
  - Execution Path: 그룹채팅방 진입 → 친구 프로필 탭 → [1:1 채팅] 버튼 탭
  - Preconditions: 로그인 계정, 친구 관계, 그룹채팅방
  - Target: ChatRoom
  - Expected State: ChatRoom.Type=OneToOne
  - Evidence: Screenshot, ComponentTree
- **Check Point**: iOS에서 1:1 채팅방 내 프로필 탭 시 [1:1 채팅] 버튼이 노출되지 않는다.
  - Execution Path: 1:1 채팅방 진입 → 상대방 프로필 사진 탭
  - Preconditions: 로그인 계정, 친구 관계, 1:1 채팅방, OS=iOS
  - Target: ProfileSheet
  - Expected State: Button.1대1채팅=Hidden
  - Evidence: Screenshot, ComponentTree

## 친구 관계 관리

### 친구 아님 상태 진입 버튼

- **Check Point**: 친구가 아닌 상대 프로필 상세에 [친구 추가] 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 상대방 프로필 사진 탭
  - Preconditions: 로그인 계정, 친구 아님 상태
  - Target: ProfileSheet
  - Expected State: Button.친구추가=Shown
  - Evidence: Screenshot, ComponentTree

### 친구 추가

- **Check Point**: [친구 추가] 버튼 탭 시 친구로 추가되고 친구 상태 UI 로 변경 노출된다.
  - Execution Path: 프로필 상세 진입 → [친구 추가] 버튼 탭
  - Preconditions: 로그인 계정, 친구 아님 상태
  - Target: ProfileSheet
  - Expected State: FriendState=Friend
  - Evidence: Screenshot, ComponentTree, APIResponse
- **Check Point**: 친구 추가 후 대화상대 목록의 해당 유저가 친구 상태 UI 로 갱신된다.
  - Execution Path: 프로필 상세 진입 → [친구 추가] 버튼 탭 → 대화상대 목록 확인
  - Preconditions: 로그인 계정, 친구 아님 상태
  - Target: MemberList
  - Expected State: MemberList.FriendState=Friend
  - Evidence: Screenshot, ComponentTree

### 차단 메뉴 노출

- **Check Point**: 친구 아닌 상대 프로필 상단 더보기 메뉴에 [차단] 항목이 노출된다.
  - Execution Path: 프로필 상세 진입 → 프로필 상단 더보기 탭
  - Preconditions: 로그인 계정, 친구 아님 상태
  - Target: ContextMenu
  - Expected State: Menu.차단=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 더보기 [차단] 하위에 [메시지 차단] 및 [메시지 차단, 프로필 비공개] 옵션이 노출된다.
  - Execution Path: 프로필 상세 진입 → 프로필 상단 더보기 탭 → [차단] 탭
  - Preconditions: 로그인 계정, 친구 아님 상태
  - Target: ContextMenu
  - Expected State: Menu.차단옵션=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 친구 아닌 상대 프로필 상단 더보기 메뉴에 [신고] 항목이 노출된다.
  - Execution Path: 프로필 상세 진입 → 프로필 상단 더보기 탭
  - Preconditions: 로그인 계정, 친구 아님 상태
  - Target: ContextMenu
  - Expected State: Menu.신고=Shown
  - Evidence: Screenshot, ComponentTree

### 차단 진행

- **Check Point**: 차단 메뉴 내 차단 버튼 탭 시 '친구를 차단하면 메시지를 받을 수 없으며, 친구 목록에서 삭제돼요.' 친구 차단 얼럿이 노출된다.
  - Execution Path: 더보기 메뉴 진입 → 차단 버튼 탭
  - Preconditions: 로그인 계정, 친구 아님 상태
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 친구 차단 얼럿 [취소] 탭 시 얼럿이 닫힌다.
  - Execution Path: 차단 얼럿 노출 → [취소] 버튼 탭
  - Preconditions: 로그인 계정, 친구 아님 상태
  - Target: Alert
  - Expected State: Alert=Dismissed
  - Evidence: Screenshot
- **Check Point**: 친구 차단 얼럿 [차단] 탭 시 해당 유저가 차단 상태 UI 로 변경 노출된다.
  - Execution Path: 차단 얼럿 노출 → [차단] 버튼 탭
  - Preconditions: 로그인 계정, 친구 아님 상태
  - Target: ProfileSheet
  - Expected State: FriendState=Blocked
  - Evidence: Screenshot, ComponentTree, APIResponse
- **Check Point**: 차단 후 대화상대 목록의 해당 유저가 차단 상태 UI 로 갱신된다.
  - Execution Path: 차단 얼럿 노출 → [차단] 버튼 탭 → 대화상대 목록 확인
  - Preconditions: 로그인 계정, 친구 아님 상태
  - Target: MemberList
  - Expected State: MemberList.FriendState=Blocked
  - Evidence: Screenshot, ComponentTree

### 차단 해제

- **Check Point**: 차단 상태 유저 프로필 상세에 [차단 해제] 버튼이 노출된다.
  - Execution Path: 대화상대 목록 진입 → 차단 상태 유저 프로필 탭
  - Preconditions: 로그인 계정, 차단 상태
  - Target: ProfileSheet
  - Expected State: Button.차단해제=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: [차단 해제] 버튼 탭 시 차단이 해제되고 친구 아님 상태 UI 로 변경 노출된다.
  - Execution Path: 차단 상태 유저 프로필 진입 → [차단 해제] 버튼 탭
  - Preconditions: 로그인 계정, 차단 상태
  - Target: ProfileSheet
  - Expected State: FriendState=NotFriend
  - Evidence: Screenshot, ComponentTree, APIResponse

## 대화상대 초대

### 초대 진입

- **Check Point**: 친구 상태에서 [+ 초대하기] 버튼 탭 시 대화상대 초대 페이지가 노출된다.
  - Execution Path: 채팅방 진입 → 대화상대 목록 진입 → [+ 초대하기] 버튼 탭
  - Preconditions: 로그인 계정, 친구 관계
  - Target: InvitePage
  - Expected State: InvitePage=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 친구 아님 상태에서 [+ 초대하기] 시 '(닉네임)님을 친구로 추가해주세요.' 친구 추가 필요 얼럿이 노출되고 초대되지 않는다.
  - Execution Path: 채팅방 진입 → 대화상대 목록 진입 → [+ 초대하기] 버튼 탭
  - Preconditions: 로그인 계정, 친구 아님 상태
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 친구 추가 필요 얼럿 [확인] 탭 시 얼럿이 닫힌다.
  - Execution Path: 친구 추가 필요 얼럿 노출 → [확인] 버튼 탭
  - Preconditions: 로그인 계정, 친구 아님 상태
  - Target: Alert
  - Expected State: Alert=Dismissed
  - Evidence: Screenshot

### 친구 초대 진행

- **Check Point**: 1:1 채팅방에서 1명 이상 친구 선택 후 초대 시 새로운 그룹채팅방(프리채팅방)이 생성된다.
  - Execution Path: 1:1 채팅방 진입 → [+ 초대하기] → 1명 이상 친구 선택 → 그룹채팅방 생성
  - Preconditions: 로그인 계정, 친구 관계, 1:1 채팅방
  - Target: ChatRoom
  - Expected State: ChatRoom.Type=Group
  - Evidence: Screenshot, ComponentTree, APIResponse
- **Check Point**: 친구 초대 완료 시 채팅방에 '(닉네임)님이 (닉네임)님을 초대했습니다.' 초대 피드가 노출된다.
  - Execution Path: 채팅방 진입 → [+ 초대하기] → 친구 선택 → 초대 진행
  - Preconditions: 로그인 계정, 친구 관계
  - Target: FeedMessage
  - Expected State: InviteFeed=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 초대받은 유저가 n명인 경우 초대 피드에 초대받은 유저가 순차적으로 표시된다.
  - Execution Path: 채팅방 진입 → [+ 초대하기] → 2명 이상 친구 선택 → 초대 진행
  - Preconditions: 로그인 계정, 친구 관계, 초대 대상 2명 이상
  - Target: FeedMessage
  - Expected State: InviteFeed.Users=Sequential
  - Evidence: Screenshot, OCR
- **Check Point**: 초대받은 유저의 채팅 목록 라스트 메시지가 '새로운 채팅방에 초대되었습니다.' 로 표시된다.
  - Execution Path: 초대 진행 → 초대받은 유저 채팅 목록 확인
  - Preconditions: 로그인 계정, 초대받은 유저 관점
  - Target: ChatList
  - Expected State: LastMessage=새로운채팅방에초대되었습니다
  - Evidence: Screenshot, OCR

## 초대·나가기 피드메시지

### 퇴장 피드 및 재초대 버튼

- **Check Point**: 그룹채팅방에서 대화상대 퇴장 시 '(나간 대화상대명) 님이 나갔습니다' 피드메시지가 노출된다.
  - Execution Path: 그룹채팅방 진입 → 대화상대 퇴장 → 채팅방 퇴장 피드 확인
  - Preconditions: 로그인 계정, 그룹채팅방, 대화상대가 채팅방 나감
  - Target: FeedMessage
  - Expected State: LeaveFeed=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 친구인 나간 상대의 퇴장 피드에 [채팅방으로 초대하기] 버튼이 노출된다.
  - Execution Path: 그룹채팅방 진입 → 퇴장 피드 확인
  - Preconditions: 로그인 계정, 그룹채팅방, 나간 상대와 친구 관계
  - Target: FeedMessage
  - Expected State: Button.채팅방으로초대하기=Shown
  - Evidence: Screenshot, ComponentTree

### 재초대 진행

- **Check Point**: [채팅방으로 초대하기] 버튼 탭 시 '(나간 대화상대명)님을 채팅방으로 초대하시겠습니까?' 초대 얼럿이 노출된다.
  - Execution Path: 퇴장 피드 확인 → [채팅방으로 초대하기] 버튼 탭
  - Preconditions: 로그인 계정, 그룹채팅방, 나간 상대와 친구 관계
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 초대 얼럿 [취소] 탭 시 얼럿이 닫힌다.
  - Execution Path: 초대 얼럿 노출 → [취소] 버튼 탭
  - Preconditions: 로그인 계정, 그룹채팅방
  - Target: Alert
  - Expected State: Alert=Dismissed
  - Evidence: Screenshot
- **Check Point**: 초대 얼럿 [확인] 탭 시 채팅방에 초대 피드메시지가 노출된다.
  - Execution Path: 초대 얼럿 노출 → [확인] 버튼 탭
  - Preconditions: 로그인 계정, 그룹채팅방, 나간 상대와 친구 관계
  - Target: FeedMessage
  - Expected State: InviteFeed=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 초대 얼럿 [확인] 탭 시 나간 대화상대가 다시 채팅방에 초대된다.
  - Execution Path: 초대 얼럿 노출 → [확인] 버튼 탭
  - Preconditions: 로그인 계정, 그룹채팅방, 나간 상대와 친구 관계
  - Target: ChatRoom
  - Expected State: Member=Rejoined
  - Evidence: ComponentTree, APIResponse

### 재초대 버튼 노출 조건

- **Check Point**: 나간 상대가 이미 채팅방에 재진입한 경우 퇴장 피드에 [채팅방으로 초대하기] 버튼이 노출되지 않는다.
  - Execution Path: 그룹채팅방 진입 → 나간 상대 재진입 → 퇴장 피드 확인
  - Preconditions: 로그인 계정, 그룹채팅방, 나간 상대가 채팅방 재진입 완료
  - Target: FeedMessage
  - Expected State: Button.채팅방으로초대하기=Hidden
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 친구가 아닌 나간 상대의 퇴장 피드에는 [초대하기] 메뉴가 노출되지 않는다.
  - Execution Path: 그룹채팅방 진입 → 퇴장 피드 확인
  - Preconditions: 로그인 계정, 그룹채팅방, 나간 상대와 친구 아님 상태
  - Target: FeedMessage
  - Expected State: Button.채팅방으로초대하기=Hidden
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 친구가 아니던 상대를 친구 추가한 후 퇴장 피드에 [초대하기] 메뉴가 노출된다.
  - Execution Path: 그룹채팅방 진입 → 나간 상대 친구 추가 → 퇴장 피드 확인
  - Preconditions: 로그인 계정, 그룹채팅방, 나간 상대 친구 추가 완료
  - Target: FeedMessage
  - Expected State: Button.채팅방으로초대하기=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 친구였던 나간 상대를 차단한 후 퇴장 피드에는 [초대하기] 메뉴가 노출되지 않는다.
  - Execution Path: 그룹채팅방 진입 → 나간 상대 차단 → 퇴장 피드 확인
  - Preconditions: 로그인 계정, 그룹채팅방, 나간 상대 차단 완료
  - Target: FeedMessage
  - Expected State: Button.채팅방으로초대하기=Hidden
  - Evidence: Screenshot, ComponentTree

### 차단 관계 초대 예외

- **Check Point**: 나를 차단한 상대와의 1:1 채팅방에서 메시지 발신 시 퇴장 피드가 발생하지 않는다.
  - Execution Path: 1:1 채팅방 진입 → 메시지 발신
  - Preconditions: 로그인 계정, 1:1 채팅방, 대화방을 나간 상대가 나를 차단한 상태
  - Target: FeedMessage
  - Expected State: LeaveFeed=Absent
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 나를 차단한 상대는 1:1 채팅방에서 발신한 메시지를 수신하지 못한다.
  - Execution Path: 1:1 채팅방 진입 → 메시지 발신
  - Preconditions: 로그인 계정, 1:1 채팅방, 대화방을 나간 상대가 나를 차단한 상태
  - Target: MessageStatus
  - Expected State: MessageDelivered=False
  - Evidence: APIResponse, Log
- **Check Point**: 나를 차단한 상대에게 단체 채팅방에서 [채팅방으로 초대하기] 탭 시 초대 얼럿이 노출된다.
  - Execution Path: 단체 채팅방 진입 → [채팅방으로 초대하기] 버튼 탭
  - Preconditions: 로그인 계정, 그룹채팅방, 대화방을 나간 상대가 나를 차단한 상태
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot
- **Check Point**: 나를 차단한 상대는 초대 얼럿 [확인] 후에도 단체 채팅방에 초대되지 않는다.
  - Execution Path: 단체 채팅방 진입 → [채팅방으로 초대하기] 버튼 탭 → 얼럿 [확인] 버튼 탭
  - Preconditions: 로그인 계정, 그룹채팅방, 대화방을 나간 상대가 나를 차단한 상태
  - Target: ChatRoom
  - Expected State: Member=NotInvited
  - Evidence: ComponentTree, APIResponse

### 피드 예외 케이스

- **Check Point**: 채팅방 나가기가 반복된 경우 각 퇴장 피드가 현재 상태를 반영하여 동일하게 표시된다.
  - Execution Path: 그룹채팅방 진입 → 채팅방 나가기 반복 → 각 퇴장 피드 확인
  - Preconditions: 로그인 계정, 그룹채팅방, 채팅방 나가기 반복으로 피드 여러 개 존재
  - Target: FeedMessage
  - Expected State: LeaveFeed.State=Consistent
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 탈퇴한 상대를 초대 시도 시 '초대하려는 친구는 탈퇴한 사용자입니다.' 친구 탈퇴 얼럿이 노출된다.
  - Execution Path: 그룹채팅방 진입 → 퇴장 피드 확인 → [채팅방으로 초대하기] 탭
  - Preconditions: 로그인 계정, 그룹채팅방, 나간 상대가 카카오톡 탈퇴
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 탈퇴 얼럿 [확인] 후 채팅방 재진입 시 퇴장 피드에 [채팅방으로 초대하기] 버튼이 노출되지 않는다.
  - Execution Path: 탈퇴 얼럿 노출 → [확인] 버튼 탭 → 채팅방 재진입 → 퇴장 피드 확인
  - Preconditions: 로그인 계정, 그룹채팅방, 나간 상대가 카카오톡 탈퇴
  - Target: FeedMessage
  - Expected State: Button.채팅방으로초대하기=Hidden
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 친구 목록 동기화 후 탈퇴 상대의 퇴장 피드 내 유저명이 '(알수 없음)' 으로 변경된다.
  - Execution Path: 친구 목록 동기화 → 퇴장 피드 확인
  - Preconditions: 로그인 계정, 그룹채팅방, 나간 상대가 카카오톡 탈퇴
  - Target: FeedMessage
  - Expected State: UserName=알수없음
  - Evidence: Screenshot, OCR

## 초대거부 및 나가기

### 초대거부 및 나가기 진행

- **Check Point**: 하단 [초대거부 및 나가기] 버튼 탭 시 '채팅방을 초대거부하고 나가시겠어요?' 초대거부 및 나가기 얼럿이 노출된다.
  - Execution Path: 채팅방 진입 → 하단 [초대거부 및 나가기] 버튼 탭
  - Preconditions: 로그인 계정, 초대 대기 채팅방
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 초대거부 및 나가기 얼럿 [취소] 탭 시 얼럿이 닫히고 채팅방이 유지된다.
  - Execution Path: 초대거부 및 나가기 얼럿 노출 → [취소] 버튼 탭
  - Preconditions: 로그인 계정, 초대 대기 채팅방
  - Target: ChatRoom
  - Expected State: ChatRoom=Retained
  - Evidence: Screenshot
- **Check Point**: 체크박스 동의 후 얼럿 [나가기] 탭 시 채팅방 나가기가 처리되어 채팅목록에서 사라진다.
  - Execution Path: 초대거부 및 나가기 얼럿 노출 → 체크박스 동의 → [나가기] 버튼 탭
  - Preconditions: 로그인 계정, 초대 대기 채팅방
  - Target: ChatList
  - Expected State: ChatRoom=Removed
  - Evidence: Screenshot, ComponentTree, APIResponse

### 초대거부 후 재초대

- **Check Point**: 초대거부 및 나가기한 유저를 재초대 시 해당 채팅방에 초대되지 않는다.
  - Execution Path: 채팅방 진입 → 나가기한 유저 재초대
  - Preconditions: 로그인 계정, 대상 유저가 초대거부 및 나가기한 상태
  - Target: ChatRoom
  - Expected State: Member=NotInvited
  - Evidence: ComponentTree, APIResponse
- **Check Point**: 재초대 시 '이 채팅방에 참여하지 못하는 친구는 초대에서 제외되었습니다.' 얼럿이 노출된다.
  - Execution Path: 채팅방 진입 → 나가기한 유저 재초대
  - Preconditions: 로그인 계정, 대상 유저가 초대거부 및 나가기한 상태
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR

# 챗봇

> 검증 그룹 6 · 항목 14 · 체크포인트 50

## 챗봇 진입

### 사이드메뉴 진입

- **Check Point**: 사이드메뉴의 '챗봇 beta' 메뉴 탭 시 챗봇 beta 화면이 열린다.
  - Execution Path: 채팅방 진입 → 채팅방 사이드메뉴 열기 → 챗봇 beta 메뉴 탭
  - Preconditions: 로그인 계정, 채팅방 종류: 팀채팅방
  - Target: ChatbotScreen
  - Expected State: ChatbotScreen=Opened
  - Evidence: Screenshot, ComponentTree

### 챗봇 목록 화면 구성

- **Check Point**: 챗봇 beta 화면 진입 시 챗봇 목록으로 이동된다.
  - Execution Path: 채팅방 사이드메뉴 열기 → 챗봇 beta 메뉴 탭
  - Preconditions: 로그인 계정
  - Target: ChatbotList
  - Expected State: ChatbotList=Displayed
  - Evidence: Screenshot, ComponentTree
- **Check Point**: iOS에서는 상단에 닫기(X) 버튼이 노출된다.
  - Execution Path: 챗봇 목록 진입
  - Preconditions: OS: iOS, 로그인 계정
  - Target: Header
  - Expected State: CloseButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: Android에서는 상단에 뒤로가기(←) 버튼이 노출된다.
  - Execution Path: 챗봇 목록 진입
  - Preconditions: OS: Android, 로그인 계정
  - Target: Header
  - Expected State: BackButton=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 챗봇 목록은 '추천', '사용중', '발견' 섹션으로 노출된다.
  - Execution Path: 챗봇 목록 진입
  - Preconditions: 로그인 계정
  - Target: ChatbotList
  - Expected State: Sections=[추천,사용중,발견]
  - Evidence: Screenshot, ComponentTree

## 챗봇 추가

### 추천 챗봇 추가

- **Check Point**: 추천 목록의 챗봇 [추가] 버튼 탭 시 해당 챗봇이 채팅방에 추가된다.
  - Execution Path: 챗봇 목록 진입 → 추천 목록 선택 → 챗봇 [추가] 버튼 탭
  - Preconditions: 로그인 계정, 채팅방 종류: 팀채팅방, 추천 챗봇 존재
  - Target: ChatbotList
  - Expected State: Chatbot=Added
  - Evidence: Screenshot, APIResponse, ComponentTree
- **Check Point**: 챗봇 추가 시 채팅방에 '{멤버명}님이 {챗봇명}을/를 추가했습니다.' 피드가 노출된다.
  - Execution Path: 추천 챗봇 [추가] 탭 → 채팅방 복귀
  - Preconditions: 로그인 계정, 채팅방 종류: 팀채팅방
  - Target: FeedMessage
  - Expected State: FeedMessage=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 챗봇 추가 시 해당 챗봇으로부터 웰컴 메시지를 수신한다.
  - Execution Path: 추천 챗봇 [추가] 탭 → 채팅방 복귀
  - Preconditions: 로그인 계정, 채팅방 종류: 팀채팅방
  - Target: Bubble
  - Expected State: WelcomeMessage=Received
  - Evidence: Screenshot, APIResponse
- **Check Point**: 추천 챗봇 추가 시 해당 챗봇이 추천 목록에서 제거된다.
  - Execution Path: 추천 챗봇 [추가] 탭 → 챗봇 목록 확인
  - Preconditions: 로그인 계정
  - Target: ChatbotList
  - Expected State: 추천목록.Chatbot=Removed
  - Evidence: ComponentTree, Screenshot
- **Check Point**: 추천 챗봇 추가 시 해당 챗봇이 사용중 목록에 추가된다.
  - Execution Path: 추천 챗봇 [추가] 탭 → 챗봇 목록 확인
  - Preconditions: 로그인 계정
  - Target: ChatbotList
  - Expected State: 사용중목록.Chatbot=Added
  - Evidence: ComponentTree, Screenshot
- **Check Point**: 추천 챗봇 추가 시 사용중 목록의 해당 챗봇 버튼이 [추가]에서 [제거]로 변경된다.
  - Execution Path: 추천 챗봇 [추가] 탭 → 사용중 목록 확인
  - Preconditions: 로그인 계정
  - Target: Button
  - Expected State: Button.Label=제거
  - Evidence: Screenshot, ComponentTree

### 발견 챗봇 추가

- **Check Point**: 발견 목록의 챗봇 [추가] 버튼 탭 시 해당 챗봇이 채팅방에 추가된다.
  - Execution Path: 챗봇 목록 진입 → 발견 목록 선택 → 챗봇 [추가] 버튼 탭
  - Preconditions: 로그인 계정, 채팅방 종류: 팀채팅방, 발견 챗봇 존재
  - Target: ChatbotList
  - Expected State: Chatbot=Added
  - Evidence: Screenshot, APIResponse, ComponentTree
- **Check Point**: 발견 챗봇 추가 시 해당 챗봇이 발견 목록에서 제거된다.
  - Execution Path: 발견 챗봇 [추가] 탭 → 챗봇 목록 확인
  - Preconditions: 로그인 계정
  - Target: ChatbotList
  - Expected State: 발견목록.Chatbot=Removed
  - Evidence: ComponentTree, Screenshot
- **Check Point**: 발견 챗봇 추가 시 해당 챗봇이 사용중 목록에 추가되고 버튼이 [제거]로 변경된다.
  - Execution Path: 발견 챗봇 [추가] 탭 → 사용중 목록 확인
  - Preconditions: 로그인 계정
  - Target: Button
  - Expected State: Button.Label=제거
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 발견 목록의 모든 챗봇 추가 시 '발견' 목록이 제거된다.
  - Execution Path: 발견 목록의 모든 챗봇 [추가] 탭 → 챗봇 목록 확인
  - Preconditions: 로그인 계정
  - Target: ChatbotList
  - Expected State: 발견목록=Removed
  - Evidence: ComponentTree, Screenshot

## 챗봇 멘션·명령어

### 챗봇 멘션 서제스트

- **Check Point**: 입력창에 '@' 입력 시 상단 멘션 서제스트에 챗봇과 멤버 목록이 노출된다.
  - Execution Path: 채팅방 진입 → 입력창 선택 → @ 입력
  - Preconditions: 로그인 계정, 채팅방에 사용중 챗봇 존재
  - Target: MentionSuggest
  - Expected State: MentionSuggest=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 멘션 서제스트 목록은 챗봇이 멤버보다 먼저 노출된다.
  - Execution Path: 입력창 선택 → @ 입력
  - Preconditions: 로그인 계정, 채팅방에 사용중 챗봇 존재
  - Target: MentionSuggest
  - Expected State: Order=[챗봇,멤버]
  - Evidence: ComponentTree, Screenshot
- **Check Point**: 서제스트에서 챗봇 선택 시 입력창에 챗봇 멘션이 활성화된다.
  - Execution Path: 입력창 선택 → @ 입력 → 서제스트 챗봇 목록 탭
  - Preconditions: 로그인 계정, 채팅방에 사용중 챗봇 존재
  - Target: MessageInput
  - Expected State: ChatbotMention=Activated
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 챗봇 멘션 후 메시지 전송 시 해당 챗봇으로부터 응답을 수신한다.
  - Execution Path: 챗봇 멘션 활성화 → 명령어 입력 → 전송
  - Preconditions: 로그인 계정, 채팅방에 사용중 챗봇 존재
  - Target: Bubble
  - Expected State: ChatbotResponse=Received
  - Evidence: Screenshot, APIResponse
- **Check Point**: 채팅방에서 제거된 챗봇은 멘션 서제스트 목록에 노출되지 않는다.
  - Execution Path: 챗봇 제거 → 입력창 선택 → @ 멘션 서제스트 확인
  - Preconditions: 로그인 계정, 해당 챗봇이 채팅방에서 제거된 상태
  - Target: MentionSuggest
  - Expected State: 제거된챗봇=NotListed
  - Evidence: ComponentTree, Screenshot

### 명령어 가이드

- **Check Point**: 명령어 가이드가 등록된 챗봇 멘션 시 명령어 가이드가 노출된다.
  - Execution Path: 입력창 선택 → @챗봇 멘션
  - Preconditions: 로그인 계정, 명령어 가이드가 등록된 챗봇
  - Target: CommandGuide
  - Expected State: CommandGuide=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 명령어 가이드는 스크롤 가능하다.
  - Execution Path: @챗봇 멘션 → 명령어 가이드 스크롤
  - Preconditions: 로그인 계정, 명령어 가이드가 등록된 챗봇
  - Target: CommandGuide
  - Expected State: CommandGuide.Scrollable=True
  - Evidence: Video, ComponentTree
- **Check Point**: 명령어 가이드에서 특정 명령어 탭 시 가이드가 종료되고 입력창에 명령어가 입력된다.
  - Execution Path: @챗봇 멘션 → 명령어 가이드 항목 탭
  - Preconditions: 로그인 계정, 명령어 가이드가 등록된 챗봇
  - Target: MessageInput
  - Expected State: Command=Filled
  - Evidence: Screenshot, ComponentTree

### 슬래시 명령어 입력

- **Check Point**: 입력란에 '/명령어' 텍스트 입력 시 일치하는 명령어 목록이 숏컷에 노출된다.
  - Execution Path: 입력창 선택 → /명령어 텍스트 입력
  - Preconditions: 로그인 계정, 명령어 가이드가 등록된 챗봇
  - Target: CommandShortcut
  - Expected State: CommandShortcut=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 숏컷에서 명령어 선택 시 해당 명령어가 파란색으로 활성화 표시된다.
  - Execution Path: /명령어 입력 → 숏컷 명령어 선택
  - Preconditions: 로그인 계정, 명령어 가이드가 등록된 챗봇
  - Target: CommandShortcut
  - Expected State: Command=Activated
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 명령어 전송 시 채팅방에 명령어(/명령어)가 전송된다.
  - Execution Path: 숏컷 명령어 선택 → 전송
  - Preconditions: 로그인 계정, 명령어 가이드가 등록된 챗봇
  - Target: Bubble
  - Expected State: Command=Sent
  - Evidence: Screenshot, APIResponse
- **Check Point**: 전송된 명령어 클릭 시 챗봇 채널 홈으로 이동된다.
  - Execution Path: 명령어 전송 → 전송된 명령어 클릭
  - Preconditions: 로그인 계정, 명령어 가이드가 등록된 챗봇
  - Target: ChannelHome
  - Expected State: ChannelHome=Displayed
  - Evidence: Screenshot, ComponentTree

## 챗봇 전용모드

### 전용모드 진입점

- **Check Point**: 챗봇 멘션 시 명령어 가이드 좌측에 전용모드 아이콘이 노출된다.
  - Execution Path: 입력창 선택 → @챗봇 멘션 → 명령어 가이드 노출
  - Preconditions: 로그인 계정, 채팅방에 사용중 챗봇 존재
  - Target: DedicatedModeIcon
  - Expected State: DedicatedModeIcon=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 전용모드 아이콘은 디폴트로 OFF 상태로 노출된다.
  - Execution Path: @챗봇 멘션 → 전용모드 아이콘 확인
  - Preconditions: 로그인 계정, 채팅방에 사용중 챗봇 존재
  - Target: DedicatedModeToggle
  - Expected State: DedicatedMode=Off
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 전용모드 아이콘 위로 안내 툴팁이 최초 1회 노출된다.
  - Execution Path: @챗봇 멘션 → 전용모드 아이콘 확인
  - Preconditions: 로그인 계정, 전용모드 툴팁 미노출 이력
  - Target: Tooltip
  - Expected State: Tooltip=ShownOnce
  - Evidence: Screenshot, ComponentTree

### 전용모드 활성화

- **Check Point**: 비활성화 상태의 챗봇 아이콘 탭 시 챗봇 전용모드가 활성화된다.
  - Execution Path: @챗봇 멘션 → 명령어 가이드 좌측 챗봇 아이콘 탭
  - Preconditions: 로그인 계정, 전용모드 OFF 상태
  - Target: DedicatedModeToggle
  - Expected State: DedicatedMode=On
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 전용모드 활성화 시점에 안내 툴팁이 최초 1회 노출된다.
  - Execution Path: 챗봇 아이콘 탭 → 전용모드 활성화
  - Preconditions: 로그인 계정, 전용모드 활성화 툴팁 미노출 이력
  - Target: Tooltip
  - Expected State: Tooltip=ShownOnce
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 전용모드 활성화 후 명령어 전송 시 멘션한 챗봇으로부터 응답을 수신한다.
  - Execution Path: 전용모드 활성화 → 명령어 입력 후 전송
  - Preconditions: 로그인 계정, 전용모드 ON 상태
  - Target: Bubble
  - Expected State: ChatbotResponse=Received
  - Evidence: Screenshot, APIResponse
- **Check Point**: 전용모드에서 챗봇 발화 이후 입력창 상단뷰가 재노출된다.
  - Execution Path: 전용모드 활성화 → 명령어 전송 → 챗봇 응답 수신
  - Preconditions: 로그인 계정, 전용모드 ON 상태
  - Target: InputTopView
  - Expected State: InputTopView=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 전용모드에서 챗봇 발화 이후 입력창이 자동 멘션 상태로 유지된다.
  - Execution Path: 전용모드 활성화 → 명령어 전송 → 챗봇 응답 수신
  - Preconditions: 로그인 계정, 전용모드 ON 상태
  - Target: MessageInput
  - Expected State: ChatbotMention=AutoRetained
  - Evidence: Screenshot, ComponentTree

### 전용모드 비활성화

- **Check Point**: 활성화 상태의 전용모드 아이콘 탭 시 챗봇 전용모드가 비활성화된다.
  - Execution Path: 전용모드 활성화 상태 → 전용모드 활성화 아이콘 탭
  - Preconditions: 로그인 계정, 전용모드 ON 상태
  - Target: DedicatedModeToggle
  - Expected State: DedicatedMode=Off
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 전용모드 비활성화 후 챗봇 발화 이후 입력창 상단뷰가 미노출된다.
  - Execution Path: 전용모드 비활성화 → 명령어 전송 → 챗봇 응답 수신
  - Preconditions: 로그인 계정, 전용모드 OFF 상태
  - Target: InputTopView
  - Expected State: InputTopView=Hidden
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 전용모드 비활성화 후 챗봇 발화 이후 입력창 멘션이 미노출된다.
  - Execution Path: 전용모드 비활성화 → 명령어 전송 → 챗봇 응답 수신
  - Preconditions: 로그인 계정, 전용모드 OFF 상태
  - Target: MessageInput
  - Expected State: ChatbotMention=Hidden
  - Evidence: Screenshot, ComponentTree

## 챗봇 제거

### 제거 얼럿

- **Check Point**: 사용중 목록의 챗봇 [제거] 버튼 탭 시 챗봇 제거 얼럿이 노출된다.
  - Execution Path: 챗봇 목록 진입 → 사용중 목록 선택 → 챗봇 [제거] 버튼 탭
  - Preconditions: 로그인 계정, 채팅방 종류: 팀채팅방, 채팅방에 사용중 챗봇 존재
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 제거 얼럿에서 [취소] 버튼 선택 시 얼럿이 닫히고 챗봇 목록이 유지된다.
  - Execution Path: 챗봇 [제거] 탭 → 얼럿 [취소] 버튼 탭
  - Preconditions: 로그인 계정, 제거 얼럿 노출 상태
  - Target: Alert
  - Expected State: Alert=Dismissed
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 제거 얼럿에서 [확인] 버튼 선택 시 얼럿이 닫히고 채팅방으로 이동된다.
  - Execution Path: 챗봇 [제거] 탭 → 얼럿 [확인] 버튼 탭
  - Preconditions: 로그인 계정, 제거 얼럿 노출 상태
  - Target: ChatRoom
  - Expected State: ChatRoom=Displayed
  - Evidence: Screenshot, ComponentTree

### 제거 결과 반영

- **Check Point**: 제거 얼럿 [확인] 시 해당 챗봇이 채팅방에서 제거된다.
  - Execution Path: 챗봇 [제거] 탭 → 얼럿 [확인] 버튼 탭
  - Preconditions: 로그인 계정, 채팅방 종류: 팀채팅방
  - Target: ChatbotList
  - Expected State: Chatbot=Removed
  - Evidence: APIResponse, Screenshot
- **Check Point**: 챗봇 제거 시 채팅방에 '{멤버명}님이 {챗봇명}을/를 제거했습니다.' 피드가 노출된다.
  - Execution Path: 챗봇 제거 확정 → 채팅방 확인
  - Preconditions: 로그인 계정, 채팅방 종류: 팀채팅방
  - Target: FeedMessage
  - Expected State: FeedMessage=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 추천 챗봇 제거 시 해당 챗봇이 추천 목록에 다시 추가된다.
  - Execution Path: 추천 챗봇 제거 → 챗봇 목록 확인
  - Preconditions: 로그인 계정, 제거 대상이 추천 챗봇
  - Target: ChatbotList
  - Expected State: 추천목록.Chatbot=Added
  - Evidence: ComponentTree, Screenshot
- **Check Point**: 챗봇 제거 시 해당 챗봇이 사용중 목록에서 제거된다.
  - Execution Path: 챗봇 제거 확정 → 챗봇 목록 확인
  - Preconditions: 로그인 계정
  - Target: ChatbotList
  - Expected State: 사용중목록.Chatbot=Removed
  - Evidence: ComponentTree, Screenshot
- **Check Point**: 사용중 목록의 모든 챗봇 제거 시 '사용중' 목록이 제거된다.
  - Execution Path: 사용중 목록의 모든 챗봇 제거 → 챗봇 목록 확인
  - Preconditions: 로그인 계정
  - Target: ChatbotList
  - Expected State: 사용중목록=Removed
  - Evidence: ComponentTree, Screenshot
- **Check Point**: 챗봇 제거 시 발견 목록의 해당 챗봇 버튼이 [제거]에서 [추가]로 변경된다.
  - Execution Path: 챗봇 제거 확정 → 발견 목록 확인
  - Preconditions: 로그인 계정, 제거 대상이 발견 목록에 존재
  - Target: Button
  - Expected State: Button.Label=추가
  - Evidence: Screenshot, ComponentTree

## 도움말·설정

### 챗봇 도움말

- **Check Point**: 챗봇 목록에서 챗봇 탭 시 챗봇 도움말 하프뷰가 노출된다.
  - Execution Path: 챗봇 목록 진입 → 챗봇 항목 탭
  - Preconditions: 로그인 계정
  - Target: HelpHalfView
  - Expected State: HelpHalfView=Shown
  - Evidence: Screenshot, ComponentTree

### 챗봇 설정

- **Check Point**: 도움말의 [설정] 탭 시 설정 페이지 웹뷰로 이동된다.
  - Execution Path: 챗봇 목록 진입 → 사용중 챗봇 탭 → 도움말 [설정] 탭
  - Preconditions: 로그인 계정, 채팅방에 사용중 챗봇 존재
  - Target: SettingsWebView
  - Expected State: SettingsWebView=Displayed
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 설정 페이지의 '알림메시지 받기'는 디폴트로 ON 상태로 노출된다.
  - Execution Path: 도움말 [설정] 탭 → 설정 웹뷰 확인
  - Preconditions: 로그인 계정, 설정 웹뷰 진입 상태
  - Target: NotificationToggle
  - Expected State: NotificationToggle=On
  - Evidence: Screenshot, OCR

# 위치공유·미니게임

> 검증 그룹 8 · 항목 13 · 체크포인트 43

## 플러스 메뉴 노출

### 채팅방 종류별 메뉴 구성

- **Check Point**: 친구위치 미지원 채팅방에서 플러스메뉴 아이콘 탭 시 메뉴가 모달뷰 형태로 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 플러스메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 친구위치 미지원 채팅방(나와의채팅/오픈/그룹)
  - Target: PlusMenu
  - Expected State: PlusMenu=ModalView
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 친구위치 지원 채팅방에서 플러스메뉴 탭 시 목록에 [친구위치] 메뉴가 포함되어 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 친구위치 지원 채팅방(1:1/그룹/팀)
  - Target: PlusMenu
  - Expected State: PlusMenu.Item.FriendLocation=Visible
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 채팅 가능 채널방에서 플러스메뉴 탭 시 제한된 메뉴([사진][카메라][톡클라우드][캡처][음성메시지][파일])만 노출된다.
  - Execution Path: 채널방 진입 → 플러스메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 채팅 가능 채널방
  - Target: PlusMenu
  - Expected State: PlusMenu.Items=Restricted
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 채팅 불가능 채널방에서는 플러스메뉴가 미노출된다.
  - Execution Path: 채팅 불가 채널방 진입 → 플러스메뉴 영역 확인
  - Preconditions: 로그인 계정, 채팅 불가능 채널방
  - Target: PlusMenu
  - Expected State: PlusMenu=NotShown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 비구독 유저는 플러스메뉴 목록에서 [톡클라우드] 메뉴가 제외되어 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 구독 유저 아님
  - Target: PlusMenu
  - Expected State: PlusMenu.Item.TalkCloud=Hidden
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 리스트형 플러스메뉴 ON일 때 [카메라] 메뉴가 최상단 최근 사진 영역에 위치한다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 아이콘 탭
  - Preconditions: 로그인 계정, 리스트형 플러스메뉴 ON
  - Target: PlusMenu
  - Expected State: PlusMenu.Item.Camera=TopRecentPhotoArea
  - Evidence: Screenshot, ComponentTree

## 친구위치 진입

### 카톡 위치 정보 이용동의

- **Check Point**: 위치정보 이용동의 미동의 상태에서 [친구위치] 선택 시 위치 정보 이용동의 팝업이 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 아이콘 탭 → [친구위치] 선택
  - Preconditions: 카톡 위치정보 수집·이용동의 N, 위치공유 참여중 N, 친구위치 지원 채팅방
  - Target: LocationConsentPopup
  - Expected State: LocationConsentPopup=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 위치정보 이용동의 팝업 내 '위치기반 서비스 이용약관' 하이퍼링크 선택 시 약관 화면으로 랜딩된다.
  - Execution Path: 위치 정보 이용동의 팝업 노출 → 위치기반 서비스 이용약관 하이퍼링크 선택
  - Preconditions: 카톡 위치정보 수집·이용동의 N
  - Target: TermsWebView
  - Expected State: TermsWebView=Landed
  - Evidence: Screenshot
- **Check Point**: 위치정보 이용동의 팝업 [취소] 시 OS 위치 설정을 스킵하고 다음 플로우로 진행된다.
  - Execution Path: 위치 정보 이용동의 팝업 노출 → [취소] 선택
  - Preconditions: 카톡 위치정보 수집·이용동의 N, OS: Android
  - Target: LocationConsentPopup
  - Expected State: Flow=Proceeded
  - Evidence: Screenshot, Log
- **Check Point**: 위치정보 이용동의 팝업 [동의] 후 카톡 앱 OS 위치 권한 허용 팝업이 노출된다.
  - Execution Path: 위치 정보 이용동의 팝업 노출 → [동의] 선택
  - Preconditions: 카톡 위치정보 수집·이용동의 N
  - Target: OSLocationPermissionPopup
  - Expected State: OSLocationPermissionPopup=Shown
  - Evidence: Screenshot

### 친구위치 바텀시트 노출

- **Check Point**: OS 위치 권한 비허용 시 스태틱맵 없는 바텀시트(기본 지도 이미지 배경)가 노출된다.
  - Execution Path: 위치정보 이용동의 [동의] → OS 위치 권한 허용 팝업 [취소]
  - Preconditions: 톡 위치정보 이용동의 Y, 카톡 앱 OS 위치 권한 N
  - Target: FriendLocationBottomSheet
  - Expected State: FriendLocationBottomSheet=NoStaticMap
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 스태틱맵 없는 바텀시트에서 지도 중앙에 내 톡 프로필 마커가 표시된다.
  - Execution Path: 스태틱맵 없는 바텀시트 노출
  - Preconditions: 톡 위치정보 이용동의 Y, 카톡 앱 OS 위치 권한 N
  - Target: ProfileMarker
  - Expected State: ProfileMarker.Position=Center
  - Evidence: Screenshot, ComponentTree
- **Check Point**: OS 위치 권한 허용 시 스태틱맵 있는 바텀시트(내 현위치 기준 지도 배경)가 노출된다.
  - Execution Path: 위치정보 이용동의 [동의] → OS 위치 권한 허용 팝업 [확인]
  - Preconditions: 톡 위치정보 이용동의 Y, 카톡 앱 OS 위치 권한 Y
  - Target: FriendLocationBottomSheet
  - Expected State: FriendLocationBottomSheet=StaticMap
  - Evidence: Screenshot, APIResponse
- **Check Point**: 스태틱맵 있는 바텀시트에서 내 현위치 프로필 마커 위에 '나 여기' 말풍선 이미지가 표시된다.
  - Execution Path: 스태틱맵 있는 바텀시트 노출
  - Preconditions: 톡 위치정보 이용동의 Y, 카톡 앱 OS 위치 권한 Y
  - Target: ProfileMarker
  - Expected State: ProfileMarker.Tooltip=Shown
  - Evidence: Screenshot, ComponentTree

## 친구위치 그룹 참여

### 그룹 동의창 분기

- **Check Point**: 위치그룹 없는 채팅방에서 카카오맵 로그인 완료 시 그룹 시작 동의창 팝업이 노출된다.
  - Execution Path: 플러스메뉴 [친구위치] 선택 → 바텀시트 [동의 후 카카오맵에서 시작] → 카카오맵 로그인 완료 → 그룹 시작 동의화면 확인
  - Preconditions: 카카오톡 로그인 계정, 카카오맵 로그인 계정(채팅방 멤버), 해당 채팅방 위치그룹 없음
  - Target: GroupStartConsentPopup
  - Expected State: GroupStartConsentPopup=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 위치그룹 있는 채팅방에서 카카오맵 로그인 완료 시 그룹 참여 동의창 팝업이 노출된다.
  - Execution Path: 플러스메뉴 [친구위치] 선택 → 바텀시트 [동의 후 카카오맵에서 시작] → 카카오맵 로그인 완료 → 그룹 참여 동의화면 확인
  - Preconditions: 카카오톡 로그인 계정, 카카오맵 로그인 계정(채팅방 멤버), 해당 채팅방 위치그룹 있음
  - Target: GroupJoinConsentPopup
  - Expected State: GroupJoinConsentPopup=Shown
  - Evidence: Screenshot, ComponentTree

### 그룹 생성·참여 완료

- **Check Point**: 그룹 시작 동의창 [동의하기] 시 그룹 이름 설정창이 모달뷰 화면으로 랜딩된다.
  - Execution Path: 그룹 시작 동의창 노출 → [동의하기] 선택
  - Preconditions: 카카오톡·카카오맵 계정 일치, 채팅방 멤버 100명 미만, 참여중인 위치 그룹수 10개 미만
  - Target: GroupNameModal
  - Expected State: GroupNameModal=Landed
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 그룹 시작 동의창 초대 진행 후 초대 완료 팝업이 노출된다.
  - Execution Path: 그룹 시작 동의화면 [동의하고 초대 보내기]
  - Preconditions: 채팅방 멤버 100명 미만, 참여중인 위치 그룹수 10개 미만, 선택 그룹 참여 인원 30명 미만
  - Target: InviteCompletePopup
  - Expected State: InviteCompletePopup=Shown
  - Evidence: Screenshot
- **Check Point**: 초대 완료 팝업 [카카오톡 열기] 시 그룹 Join에 성공하여 그룹홈에 입장된다.
  - Execution Path: 초대 완료 팝업 노출 → [카카오톡 열기] 선택
  - Preconditions: 선택 그룹 참여 인원 30명 미만
  - Target: GroupHome
  - Expected State: GroupJoin=Success
  - Evidence: Screenshot, APIResponse
- **Check Point**: 그룹 참여 동의창 [동의하고 참여하기] 시 그룹 Join에 성공하여 그룹홈에 입장된다.
  - Execution Path: 그룹 참여 동의창 노출 → [동의하고 참여하기] 선택
  - Preconditions: 해당 채팅방 위치그룹 있음, 선택 그룹 참여 인원 30명 미만
  - Target: GroupHome
  - Expected State: GroupJoin=Success
  - Evidence: Screenshot, APIResponse

## 미니게임 목록

### 게임 목록 웹뷰

- **Check Point**: 플러스메뉴 [미니게임] 선택 시 게임 목록이 바텀시트 웹뷰 형태로 노출된다.
  - Execution Path: 채팅방 진입 → 플러스메뉴 아이콘 탭 → [미니게임] 선택
  - Preconditions: 1:1 또는 그룹 채팅방
  - Target: MiniGameBottomSheet
  - Expected State: MiniGameBottomSheet=WebView
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 게임 히스토리가 없으면 게임별 말풍선이 랜덤으로 노출된다.
  - Execution Path: 미니게임 목록 노출 → 말풍선 영역 확인
  - Preconditions: 게임 히스토리 없음
  - Target: GameBubble
  - Expected State: GameBubble=Random
  - Evidence: Screenshot
- **Check Point**: 게임 히스토리 여부와 무관하게 두근두근 선물게임은 '최근' 영역에 미표시된다.
  - Execution Path: 미니게임 목록 노출 → 최근 영역 확인
  - Preconditions: 게임 히스토리 있음
  - Target: RecentGameArea
  - Expected State: GiftGame.RecentArea=Hidden
  - Evidence: Screenshot, ComponentTree

## 돌림판

### 돌림판 생성

- **Check Point**: 돌림판 진입 시 디폴트 항목 2개로 바텀시트 웹뷰가 노출된다.
  - Execution Path: 미니게임 목록 웹뷰 → 돌림판 선택
  - Preconditions: 1:1 또는 그룹 채팅방
  - Target: RouletteView
  - Expected State: RouletteView.ItemCount=2
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 항목이 2개일 때 항목 삭제(-) 버튼이 비활성화된다.
  - Execution Path: 돌림판 디폴트 생성화면 → 삭제(-) 버튼 상태 확인
  - Preconditions: 돌림판 항목 2개
  - Target: RouletteRemoveButton
  - Expected State: RouletteRemoveButton=Disabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 항목이 3개 이상일 때 항목 삭제가 가능하다.
  - Execution Path: 돌림판 항목 3개 이상 추가 → 삭제(-) 버튼 선택
  - Preconditions: 돌림판 항목 3개 이상
  - Target: RouletteRemoveButton
  - Expected State: RouletteRemoveButton=Enabled
  - Evidence: Screenshot, ComponentTree

### 돌림판 게임 진행·결과

- **Check Point**: 돌림판 세팅 후 [게임 시작하기] 시 '돌림판 게임이 시작됐어요' 말풍선 결과 뷰가 노출된다.
  - Execution Path: 돌림판 세팅 → [게임 시작하기] 선택
  - Preconditions: 돌림판 항목 2개 이상 설정
  - Target: GameResultBubble
  - Expected State: GameResultBubble=Shown
  - Evidence: Screenshot
- **Check Point**: 돌림판 게임 시작 시 애니메이션이 2~3초 속도로 회전한다.
  - Execution Path: [돌림판 게임 시작] 선택
  - Preconditions: 돌림판 참여자
  - Target: RouletteAnimation
  - Expected State: RouletteAnimation=Spinning
  - Evidence: Video, Screenshot
- **Check Point**: 돌림판 회전 종료 후 선택된 결과가 포커싱되어 노출된다.
  - Execution Path: 돌림판 회전 종료 → 결과 화면 확인
  - Preconditions: 돌림판 참여자
  - Target: RouletteResult
  - Expected State: RouletteResult=Focused
  - Evidence: Screenshot, ComponentTree

## 사다리게임

### 함께할 친구 선택

- **Check Point**: 친구 10명 미만 선택 시 함께할 친구 선택 화면(프로필 배열형)이 노출된다.
  - Execution Path: 미니게임 목록 웹뷰 → 사다리게임 선택
  - Preconditions: 선택된 친구 1~3명
  - Target: FriendSelectView
  - Expected State: FriendSelectView=DefaultLayout
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 친구 프로필 [X] 삭제 시 버튼명이 [N명 선택 완료]로 변경되고 활성화가 유지된다.
  - Execution Path: 함께할 친구 선택 화면 → 프로필 우측 상단 [X] 선택
  - Preconditions: 선택된 친구 2명 이상
  - Target: SelectCompleteButton
  - Expected State: SelectCompleteButton=Enabled
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 친구 10명 이상 선택 시 전체선택 체크가 포함된 친구 선택 피커가 노출된다.
  - Execution Path: 사다리게임 선택 → 친구 선택 피커 진입 → 친구 선택
  - Preconditions: 선택된 친구 10명 이상
  - Target: FriendSelectPicker
  - Expected State: FriendSelectPicker=Shown
  - Evidence: Screenshot, ComponentTree

### 사다리게임 진행·결과

- **Check Point**: 사다리게임 세팅 후 [게임 시작하기] 시 '사다리 게임이 시작됐어요' 말풍선 결과 뷰가 노출된다.
  - Execution Path: 사다리게임 세팅 → [게임 시작하기] 선택
  - Preconditions: 친구 선택 완료
  - Target: GameResultBubble
  - Expected State: GameResultBubble=Shown
  - Evidence: Screenshot
- **Check Point**: [사다리타기] 선택 시 내 결과 화면이 노출된다.
  - Execution Path: [사다리타기] 버튼 선택
  - Preconditions: 사다리게임 참여자, 친구 10명 미만
  - Target: LadderResult
  - Expected State: LadderResult.My=Shown
  - Evidence: Screenshot
- **Check Point**: 친구 결과 화면 [내 결과 공유하기] 선택 시 게임 결과가 말풍선 타입으로 공유된다.
  - Execution Path: 친구 결과 화면 → [내 결과 공유하기] 선택
  - Preconditions: 사다리게임 참여자, 친구 10명 미만
  - Target: ResultShareBubble
  - Expected State: ResultShareBubble=Shared
  - Evidence: Screenshot, APIResponse
- **Check Point**: 친구가 10명 이상인 경우 개별 결과 없이 전체 결과만 표시된다.
  - Execution Path: [사다리타기] 버튼 선택 → 결과 화면 확인
  - Preconditions: 사다리게임 참여자, 친구 10명 이상
  - Target: LadderResult
  - Expected State: LadderResult=TotalOnly
  - Evidence: Screenshot, ComponentTree

## 당첨뽑기

### 당첨자 수 설정

- **Check Point**: 함께할 친구 2명 이상 선택 완료 시 당첨자 수 설정 화면으로 이동된다.
  - Execution Path: 미니게임 목록 웹뷰 → 당첨자 뽑기 선택 → 함께할 친구 선택 → 친구 2명 이상 선택 완료
  - Preconditions: 1명 이상 친구 존재, 10명 미만 채팅방
  - Target: WinnerCountView
  - Expected State: WinnerCountView=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 당첨뽑기의 당첨자 수는 유저가 선택한 인원 수와 동일하게 설정된다.
  - Execution Path: 당첨자 수 화면에서 인원 조정
  - Preconditions: 10명 이상 친구 존재
  - Target: WinnerCountView
  - Expected State: WinnerCount=SelectedCount
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 당첨뽑기 구슬 그래픽 이미지는 최대 7개까지만 노출되고 이후는 숫자만 증가한다.
  - Execution Path: 당첨자 수 10명 이상 조정 → 그래픽 이미지 확인
  - Preconditions: 10명 이상 친구 존재
  - Target: MarbleGraphic
  - Expected State: MarbleGraphic.Max=7
  - Evidence: Screenshot, ComponentTree

### 당첨뽑기 진행·결과

- **Check Point**: [게임 시작하기] 선택 시 채팅방에 게임 공유 카드가 노출된다.
  - Execution Path: [게임 시작하기] 선택
  - Preconditions: 당첨자 수 설정 완료
  - Target: GameShareCard
  - Expected State: GameShareCard=Shown
  - Evidence: Screenshot
- **Check Point**: 당첨뽑기 게임 시작 시 '당첨뽑기 게임이 시작됐어요' 말풍선 결과 뷰가 노출된다.
  - Execution Path: [게임 시작하기] 선택 → 말풍선 결과 뷰 확인
  - Preconditions: 당첨자 수 설정 완료
  - Target: GameResultBubble
  - Expected State: GameResultBubble=Shown
  - Evidence: Screenshot
- **Check Point**: 당첨 결과 [전체 결과보기] 시 친구 결과 리스트에 당첨/꽝 결과가 표시된다.
  - Execution Path: 당첨 결과 화면 → [전체 결과보기] 선택
  - Preconditions: 당첨뽑기 게임 완료
  - Target: WinnerResultList
  - Expected State: WinnerResultList=Shown
  - Evidence: Screenshot, ComponentTree

## 포춘쿠키

### 포춘쿠키 결과

- **Check Point**: 포춘쿠키 세팅 후 [이 쿠키로 선택하기] 시 포춘쿠키 메시지 말풍선이 노출된다.
  - Execution Path: 미니게임 목록 웹뷰 → 포춘쿠키 선택 → 포춘쿠키 세팅 → [이 쿠키로 선택하기] 선택
  - Preconditions: 1:1 또는 그룹 채팅방
  - Target: FortuneCookieBubble
  - Expected State: FortuneCookieBubble=Shown
  - Evidence: Screenshot

# 카카오TV 인앱플레이어

> 검증 그룹 4 · 항목 13 · 체크포인트 31

## 플레이어 뷰 전환

### 미니플레이어 전환

- **Check Point**: 작게보기 아이콘 탭 시 미니플레이어로 전환된다.
  - Execution Path: 채팅방 진입 → 카카오TV 말풍선 탭 → 방송 재생 → 작게보기 아이콘 탭
  - Preconditions: 카카오TV 링크가 채팅방에 공유됨, 방송 재생 중
  - Target: MiniPlayer
  - Expected State: MiniPlayer=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 미니플레이어로 전환된 후에도 방송 재생 상태가 유지된다.
  - Execution Path: 방송 재생 → 작게보기 아이콘 탭
  - Preconditions: 카카오TV 링크가 채팅방에 공유됨, 방송 재생 중
  - Target: MiniPlayer
  - Expected State: MiniPlayer.Playback=Playing
  - Evidence: Screenshot, Video

### 플레이뷰 복귀

- **Check Point**: 미니플레이어 화면 탭 시 플레이뷰로 전환된다.
  - Execution Path: 미니플레이어 재생 중 → 미니플레이어 화면 탭
  - Preconditions: 미니플레이어 활성화
  - Target: InAppPlayer
  - Expected State: InAppPlayer=PlayView
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 플레이뷰로 복귀한 후에도 방송 재생 상태가 유지된다.
  - Execution Path: 미니플레이어 재생 중 → 미니플레이어 화면 탭
  - Preconditions: 미니플레이어 활성화
  - Target: InAppPlayer
  - Expected State: InAppPlayer.Playback=Playing
  - Evidence: Video
- **Check Point**: 미니플레이어 탭 시 닫기(X)와 크게보기 버튼이 노출된다.
  - Execution Path: 미니플레이어 재생 중 → 미니플레이어 화면 탭
  - Preconditions: 미니플레이어 활성화
  - Target: MiniPlayer
  - Expected State: MiniPlayer.Controls=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 미니플레이어에서 크게보기 탭 시 전용뷰로 전환된다.
  - Execution Path: 미니플레이어 재생 중 → 미니플레이어 화면 탭 → 크게보기 탭
  - Preconditions: 미니플레이어 활성화
  - Target: InAppPlayer
  - Expected State: InAppPlayer=DedicatedView
  - Evidence: Screenshot, ComponentTree

## 미니플레이어 이동·종료

### 드래그 이동

- **Check Point**: 미니플레이어 드래그 시 화면 범위 내에서 자유롭게 이동된다.
  - Execution Path: 미니플레이어 재생 중 → 미니플레이어 드래그
  - Preconditions: 미니플레이어 활성화
  - Target: MiniPlayer
  - Expected State: MiniPlayer.Position=Moved
  - Evidence: Screenshot, Video
- **Check Point**: 미니플레이어 드래그 이동 중에도 방송 재생 상태가 유지된다.
  - Execution Path: 미니플레이어 재생 중 → 미니플레이어 드래그
  - Preconditions: 미니플레이어 활성화
  - Target: MiniPlayer
  - Expected State: MiniPlayer.Playback=Playing
  - Evidence: Video
- **Check Point**: 미니플레이어는 기기 노티바 영역으로는 이동되지 않는다.
  - Execution Path: 미니플레이어 재생 중 → 미니플레이어를 노티바 영역으로 드래그
  - Preconditions: 미니플레이어 활성화
  - Target: MiniPlayer
  - Expected State: MiniPlayer.Position=BlockedAtNotificationBar
  - Evidence: Screenshot, Video

### 화면 아웃 종료

- **Check Point**: 미니플레이어를 화면 밖으로 50% 이상 드래그 시 종료된다.
  - Execution Path: 미니플레이어 재생 중 → 미니플레이어를 화면 50% 이상 아웃 드래그
  - Preconditions: 미니플레이어 활성화
  - Target: MiniPlayer
  - Expected State: MiniPlayer=Dismissed
  - Evidence: Screenshot, Video

## 미디어 플레이어 우선순위

### 보이스톡 진입

- **Check Point**: 보이스톡 수발신 시 미니플레이어 방송이 일시정지된다.
  - Execution Path: 미니플레이어 재생 중 → 보이스톡 수발신
  - Preconditions: 미니플레이어 활성화
  - Target: MiniPlayer
  - Expected State: MiniPlayer.Playback=Paused
  - Evidence: Video, Log
- **Check Point**: 보이스톡 수발신 시 미니플레이어 뷰가 히든 처리된다.
  - Execution Path: 미니플레이어 재생 중 → 보이스톡 수발신
  - Preconditions: 미니플레이어 활성화
  - Target: MiniPlayer
  - Expected State: MiniPlayer=Hidden
  - Evidence: Screenshot, ComponentTree

### 페이스톡 진입

- **Check Point**: 페이스톡 전체화면 수발신 시 미니플레이어 방송이 일시정지된다.
  - Execution Path: 미니플레이어 재생 중 → 페이스톡 전체화면 수발신
  - Preconditions: 미니플레이어 활성화
  - Target: MiniPlayer
  - Expected State: MiniPlayer.Playback=Paused
  - Evidence: Video, Log
- **Check Point**: 페이스톡 전체화면 수발신 시 미니플레이어 뷰가 히든 처리된다.
  - Execution Path: 미니플레이어 재생 중 → 페이스톡 전체화면 수발신
  - Preconditions: 미니플레이어 활성화
  - Target: MiniPlayer
  - Expected State: MiniPlayer=Hidden
  - Evidence: Screenshot, ComponentTree

### 채널홈 진입

- **Check Point**: 미니플레이어 재생 중 채널홈 진입 시 미니플레이어 방송이 유지된다.
  - Execution Path: 미니플레이어 재생 중 → 채널홈 진입
  - Preconditions: 미니플레이어 활성화, 동영상 자동재생 되는 채널홈
  - Target: MiniPlayer
  - Expected State: MiniPlayer.Playback=Playing
  - Evidence: Video
- **Check Point**: 채널홈 진입 시 채널홈 영상이 소리 없는 미리보기 방식으로 재생된다.
  - Execution Path: 미니플레이어 재생 중 → 채널홈 진입
  - Preconditions: 미니플레이어 활성화, 동영상 자동재생 되는 채널홈
  - Target: ChannelHome
  - Expected State: ChannelHome.Preview=Muted
  - Evidence: Video, Log
- **Check Point**: 채널홈에서 영상 재생 실행 시 미니플레이어가 미노출된다.
  - Execution Path: 채널홈 진입 → 채널홈 영상 재생 실행
  - Preconditions: 동영상 자동재생 되는 채널홈
  - Target: MiniPlayer
  - Expected State: MiniPlayer=Hidden
  - Evidence: Screenshot, ComponentTree

### 카카오TV 홈 영상 재생

- **Check Point**: 카카오TV에서 영상 재생 시 미니플레이어 방송이 일시정지된다.
  - Execution Path: 미니플레이어 재생 중 → 카카오TV에서 영상 재생
  - Preconditions: 미니플레이어 활성화
  - Target: MiniPlayer
  - Expected State: MiniPlayer.Playback=Paused
  - Evidence: Video, Log
- **Check Point**: 카카오TV에서 영상 재생 시 미니플레이어 뷰 노출이 유지된다.
  - Execution Path: 미니플레이어 재생 중 → 카카오TV에서 영상 재생
  - Preconditions: 미니플레이어 활성화
  - Target: MiniPlayer
  - Expected State: MiniPlayer=Shown
  - Evidence: Screenshot, ComponentTree

### H/W 홈키

- **Check Point**: H/W 홈키 누름 시 미니플레이어 재생 상태와 뷰가 유지된다.
  - Execution Path: 미니플레이어 재생 중 → H/W 홈키 누름
  - Preconditions: 미니플레이어 활성화, OS=Android, 물리 홈버튼 있는 단말
  - Target: MiniPlayer
  - Expected State: MiniPlayer=Shown
  - Evidence: Screenshot, Video
- **Check Point**: H/W 홈키 누름 시 미니뷰가 사라진다.
  - Execution Path: 미니플레이어 재생 중 → H/W 홈키 누름
  - Preconditions: 미니플레이어 활성화, OS=iOS, 물리 홈버튼 있는 단말
  - Target: MiniPlayer
  - Expected State: MiniPlayer=Hidden
  - Evidence: Screenshot

### 톡 강제종료

- **Check Point**: 톡 강제종료 시 미니플레이어가 함께 종료된다.
  - Execution Path: 미니플레이어 재생 중 → 톡 강제종료
  - Preconditions: 미니플레이어 활성화
  - Target: MiniPlayer
  - Expected State: MiniPlayer=Dismissed
  - Evidence: Screenshot, Log

## iOS 전용·플로팅 플레이어

### 전용 플레이어 진입

- **Check Point**: 채팅방에 공유된 카카오TV 말풍선 탭 시 전용 플레이어에서 재생된다.
  - Execution Path: 채팅방 진입 → 카카오TV 말풍선 탭
  - Preconditions: 카카오TV 링크가 채팅방에 공유됨, OS=iOS
  - Target: DedicatedPlayer
  - Expected State: DedicatedPlayer.Playback=Playing
  - Evidence: Screenshot, Video
- **Check Point**: 전용 플레이어 팝업뷰에 닫기·영상제목·더보기·플로팅 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 카카오TV 말풍선 탭
  - Preconditions: 카카오TV 링크가 채팅방에 공유됨, OS=iOS
  - Target: DedicatedPlayer
  - Expected State: DedicatedPlayer.Controls=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 전용 플레이어 영상 영역에 seek bar와 전체화면 확장 버튼이 노출된다.
  - Execution Path: 채팅방 진입 → 카카오TV 말풍선 탭
  - Preconditions: 카카오TV 링크가 채팅방에 공유됨, OS=iOS, VOD 콘텐츠
  - Target: DedicatedPlayer
  - Expected State: SeekBar=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 라이브 방송에서는 seek bar가 미노출된다.
  - Execution Path: 채팅방 진입 → 카카오TV 라이브 말풍선 탭
  - Preconditions: 카카오TV 링크가 채팅방에 공유됨, OS=iOS, 라이브 방송 콘텐츠
  - Target: DedicatedPlayer
  - Expected State: SeekBar=Hidden
  - Evidence: Screenshot, ComponentTree

### 플로팅 전환·이동

- **Check Point**: 전용 플레이어에서 [플로팅] 버튼 탭 시 TV player가 플로팅된다.
  - Execution Path: 전용 플레이어 재생 중 → [플로팅] 버튼 탭
  - Preconditions: OS=iOS, 전용 플레이어 재생 중
  - Target: FloatingPlayer
  - Expected State: FloatingPlayer=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 플로팅된 player를 drag & drop 시 디바이스 화면 내에서 자유롭게 이동된다.
  - Execution Path: 플로팅 재생 중 → 플로팅 player drag & drop
  - Preconditions: OS=iOS, 플로팅 모드 활성화
  - Target: FloatingPlayer
  - Expected State: FloatingPlayer.Position=Moved
  - Evidence: Screenshot, Video
- **Check Point**: 전체화면 player에서 [플로팅] 버튼 탭 시 플로팅 모드로 전환된다.
  - Execution Path: 전체화면 player 재생 중 → [플로팅] 버튼 탭
  - Preconditions: OS=iOS, 전체화면 player 활성화
  - Target: FloatingPlayer
  - Expected State: FloatingPlayer=Shown
  - Evidence: Screenshot, ComponentTree

### 전체화면 전환·상세

- **Check Point**: 플로팅뷰어에서 전용뷰어 버튼 선택 시 전체화면 player로 전환된다.
  - Execution Path: 플로팅 재생 중 → 전용뷰어 버튼 선택
  - Preconditions: OS=iOS, 플로팅 모드 활성화
  - Target: FullScreenPlayer
  - Expected State: FullScreenPlayer=Shown
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 전체화면 player에서 [영상 제목] 버튼 탭 시 상세 내용이 노출된다.
  - Execution Path: 전체화면 player 재생 중 → [영상 제목] 버튼 탭
  - Preconditions: OS=iOS, 전체화면 player 활성화
  - Target: DedicatedView
  - Expected State: DetailView=Shown
  - Evidence: Screenshot, ComponentTree

# 이모티콘·스티커

> 검증 그룹 3 · 항목 7 · 체크포인트 8

## 이모티콘 프리뷰

### 프리뷰 노출

- **Check Point**: 이모티콘 선택 시 프리뷰가 표시된다.
  - Execution Path: 앱 실행 → 로그인 → 채팅방 진입 → 이모티콘 탭 → 이모티콘 선택
  - Preconditions: 로그인 계정, 1:1 채팅방, 이모티콘 보유
  - Target: EmoticonPreview
  - Expected State: EmoticonPreview=Shown
  - Evidence: Screenshot, ComponentTree

### 프리뷰 애니메이션

- **Check Point**: 움직이는 유형 이모티콘 선택 시 프리뷰에서 애니메이션이 플레이된다.
  - Execution Path: 채팅방 진입 → 이모티콘 탭 → 이모티콘 선택
  - Preconditions: 로그인 계정, 애니메이션 지원 이모티콘(움직이는 스티커/애니콘)
  - Target: EmoticonPreview
  - Expected State: EmoticonPreview.Animation=Playing
  - Evidence: Video, Screenshot

### 프리뷰 사운드

- **Check Point**: 사운드 유형 이모티콘 선택 시 프리뷰에서 사운드가 플레이된다.
  - Execution Path: 채팅방 진입 → 이모티콘 탭 → 이모티콘 선택
  - Preconditions: 로그인 계정, 사운드 지원 이모티콘(움직이는 스티커(사운드)/애니콘(사운드)/큰이모티콘(사운드))
  - Target: EmoticonPreview
  - Expected State: EmoticonPreview.Sound=Playing
  - Evidence: Video, Log

## 이모티콘 송수신

### 챗로그 표시

- **Check Point**: 이모티콘 전송 시 송신측 챗로그에 이모티콘이 표시된다.
  - Execution Path: 채팅방 진입 → 이모티콘 선택 → 전송
  - Preconditions: 로그인 계정, 1:1 채팅방, 네트워크 연결
  - Target: ChatLog
  - Expected State: ChatLog.SenderEmoticon=Displayed
  - Evidence: Screenshot, ComponentTree
- **Check Point**: 이모티콘 전송 시 수신측 챗로그에 이모티콘이 표시된다.
  - Execution Path: 채팅방 진입 → 이모티콘 선택 → 전송 → 수신측 확인
  - Preconditions: 로그인 계정, 1:1 채팅방, 네트워크 연결, 수신측 단말
  - Target: ChatLog
  - Expected State: ChatLog.ReceiverEmoticon=Displayed
  - Evidence: Screenshot, ComponentTree

### 챗로그 애니메이션

- **Check Point**: 움직이는 유형 이모티콘 전송 시 송·수신측 챗로그에서 애니메이션이 플레이된다.
  - Execution Path: 채팅방 진입 → 이모티콘 선택 → 전송
  - Preconditions: 로그인 계정, 애니메이션 지원 이모티콘(움직이는 스티커/애니콘)
  - Target: ChatLog
  - Expected State: ChatLog.Animation=Playing
  - Evidence: Video, Screenshot

### 챗로그 사운드

- **Check Point**: 사운드 유형 이모티콘 전송 시 송·수신측 챗로그에서 사운드가 플레이된다.
  - Execution Path: 채팅방 진입 → 이모티콘 선택 → 전송
  - Preconditions: 로그인 계정, 사운드 지원 이모티콘(움직이는 스티커(사운드)/애니콘(사운드)/큰이모티콘(사운드))
  - Target: ChatLog
  - Expected State: ChatLog.Sound=Playing
  - Evidence: Video, Log

## 컨텍스트 메뉴

### 이모티콘 보러가기

- **Check Point**: 챗로그 이모티콘 롱탭 후 [이모티콘 보러가기] 선택 시 이모티콘 상세화면으로 랜딩된다.
  - Execution Path: 채팅방 진입 → 챗로그 이모티콘 롱탭 → [이모티콘 보러가기] 선택
  - Preconditions: 로그인 계정, 채팅방 내 이모티콘 챗로그 존재
  - Target: EmoticonDetail
  - Expected State: EmoticonDetail=Landed
  - Evidence: Screenshot

# 채팅방 생성

> 검증 그룹 2 · 항목 4 · 체크포인트 6

## 비밀채팅 생성 (친구)

### 비밀채팅방 진입

- **Check Point**: [비밀채팅 만들기] 버튼 탭 시 해당 친구와의 비밀채팅방으로 진입된다.
  - Execution Path: 앱 실행 → 로그인 → 친구 프로필 진입 → [비밀채팅 만들기] 버튼 탭
  - Preconditions: 로그인 계정, 대상이 친구로 등록된 상태
  - Target: SecretChatRoom
  - Expected State: SecretChatRoom=Entered
  - Evidence: Screenshot, ComponentTree

## 비밀채팅 생성 (친구 아님)

### 친구 추가 얼럿 노출

- **Check Point**: [비밀채팅 만들기] 버튼 탭 시 친구 추가 확인 얼럿이 노출된다.
  - Execution Path: 앱 실행 → 로그인 → 대상 프로필 진입 → [비밀채팅 만들기] 버튼 탭
  - Preconditions: 로그인 계정, 대상이 친구로 등록되지 않은 상태
  - Target: Alert
  - Expected State: Alert=Shown
  - Evidence: Screenshot, OCR
- **Check Point**: 얼럿에 "(닉네임)님을 친구로 추가하고 비밀채팅을 시작하시겠습니까?" 문구가 표시된다.
  - Execution Path: [비밀채팅 만들기] 버튼 탭
  - Preconditions: 로그인 계정, 대상이 친구로 등록되지 않은 상태
  - Target: Alert
  - Expected State: Alert.Message="(닉네임)님을 친구로 추가하고 비밀채팅을 시작하시겠습니까?"
  - Evidence: OCR

### 얼럿 취소

- **Check Point**: 친구 추가 얼럿에서 [취소] 버튼 탭 시 얼럿이 닫힌다.
  - Execution Path: [비밀채팅 만들기] 버튼 탭 → 얼럿 [취소] 버튼 탭
  - Preconditions: 로그인 계정, 대상이 친구로 등록되지 않은 상태, 친구 추가 얼럿 노출 상태
  - Target: Alert
  - Expected State: Alert=Dismissed
  - Evidence: Screenshot

### 얼럿 확인

- **Check Point**: 친구 추가 얼럿에서 [확인] 버튼 탭 시 대상이 친구로 추가된다.
  - Execution Path: [비밀채팅 만들기] 버튼 탭 → 얼럿 [확인] 버튼 탭
  - Preconditions: 로그인 계정, 대상이 친구로 등록되지 않은 상태, 친구 추가 얼럿 노출 상태
  - Target: FriendList
  - Expected State: Friend=Added
  - Evidence: APIResponse, DB
- **Check Point**: 친구 추가 얼럿에서 [확인] 버튼 탭 시 해당 친구와의 비밀채팅방으로 진입된다.
  - Execution Path: [비밀채팅 만들기] 버튼 탭 → 얼럿 [확인] 버튼 탭
  - Preconditions: 로그인 계정, 대상이 친구로 등록되지 않은 상태, 친구 추가 얼럿 노출 상태
  - Target: SecretChatRoom
  - Expected State: SecretChatRoom=Entered
  - Evidence: Screenshot, ComponentTree
