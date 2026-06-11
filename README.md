# SAWL AI Vocab Lab

GitHub Pages 배포용 고1 영어 독해 어휘 학습 사이트입니다.

## 포함 파일

- `index.html`: 사이트 본문
- `style.css`: 모바일 반응형 디자인
- `app.js`: 로그인, 달력, 퀴즈, 오답노트 기능
- `students.js`: 학생 인증 명단
- `words.js`: PDF 독해 지문 기반 어휘 데이터
- `.nojekyll`: GitHub Pages 정적 배포 보조 파일

## 주요 기능

1. 학번 + 이름 확인 후 입장
2. 오늘 날짜 출석 기록
3. 단어 학습 완료 후 퀴즈 잠금 해제
4. 문제 유형 선택
   - 단어 뜻 고르기
   - 빈칸에 알맞은 단어 고르기
   - 유의어가 아닌 것 고르기
5. 문항 수 선택
   - 5 / 10 / 15 / 20 / 가능한 만큼
6. 퀴즈 완료 시 달력 날짜에 별 표시
7. 별 개수에 따른 응원 메시지 표시
8. 퀴즈 결과 기반 오답노트 자동 생성
9. 모바일 화면 최적화

## 배포 전 수정할 부분

### 1. 학생 명단 수정

`students.js`를 열어 실제 학생 명단으로 바꾸세요.

```js
const STUDENTS = [
  { id: "10101", name: "김수원" },
  { id: "10102", name: "이외고" }
];
```

### 2. 단어 수정 또는 추가

`words.js`에서 단어를 수정하거나 추가할 수 있습니다.

필수 항목:

```js
{
  q: "21",
  word: "evaluate",
  pos: "verb",
  meaning: "평가하다",
  synonyms: ["judge", "assess", "examine"],
  antonyms: ["ignore", "guess"],
  example: "We evaluate ideas for their best fit to reality.",
  blank: "We ____ ideas for their best fit to reality."
}
```

## GitHub Pages 업로드 방법

1. GitHub에서 새 repository를 만듭니다.
2. 위 파일들을 repository의 가장 위 폴더에 업로드합니다.
3. `Settings` → `Pages`로 이동합니다.
4. `Build and deployment`에서 `Deploy from a branch`를 선택합니다.
5. Branch를 `main` / folder를 `/root`로 설정합니다.
6. 저장 후 생성된 Pages 주소를 학생에게 공유합니다.

## 중요한 제한

이 버전은 GitHub Pages용 정적 사이트입니다. 학생의 학습 기록은 학생 기기 브라우저의 `localStorage`에 저장됩니다. 따라서 교사가 학생 전체 기록을 자동으로 수합하려면 Google Sheets + Apps Script 또는 Firebase 연동 버전이 필요합니다.
