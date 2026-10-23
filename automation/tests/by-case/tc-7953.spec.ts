import { test } from '@playwright/test';

/*
Frontier Id: 7953
Area: API/Comment
Priority: High Status: Actual
Automation: covered -> automation/tests/api/api-cases-42-path.spec.ts
Reason: уже есть исполняемый тест
Preconditions: Bearer; targetId = {{assetId}} (number); required поля CreateAssetCommentRequest с конкретными значениями: targetSection="Asset" (string), targetSectionId={{assetId}} (number), content, assetName (string, напр. из {{fileName}} или "DBG_ASSET"), assetLink (string URL, напр. "https://dam.example/asset/{{assetId}}")
Expected: Create 200; GET видит content; PUT меняет content; DELETE 200; повторный GET — deletedAt заполнен или текст скрыт
Step 0: POST {{API_BASE}}/Comment body: {"targetId":{{assetId}},"targetSection":"Asset","targetSectionId":{{assetId}},"content":"DBG_CMT","assetName":"DBG_ASSET","assetLink":"https://dam.example/asset/{{assetId}}"}
  expect: HTTP 200; CommentView с id → {{commentId}}
Step 1: GET {{API_BASE}}/Comment/{{assetId}}
  expect: HTTP 200; есть комментарий с content DBG_CMT
Step 2: PUT {{API_BASE}}/Comment тело: {"targetId":{{assetId}},"id":{{commentId}},"content":"DBG_CMT_EDITED"}
  expect: HTTP 200; content == DBG_CMT_EDITED
Step 3: DELETE {{API_BASE}}/Comment/{{assetId}}/{{commentId}}
  expect: HTTP 200
Step 4: GET {{API_BASE}}/Comment/{{assetId}}
  expect: HTTP 200; у удалённого комментария deletedAt заполнен и/или текст скрыт (не отображается как активный DBG_CMT_EDITED)
Импорт в Frontier: testcases-import/7953.json
*/

test('7953 API-CMT-01 CRUD комментария с проверкой deletedAt', async () => {
  test.skip(true, 'Уже автоматизирован: automation/tests/api/api-cases-42-path.spec.ts');
});
