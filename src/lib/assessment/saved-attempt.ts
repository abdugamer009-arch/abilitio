/** Browser bookkeeping cannot turn an acknowledged server save into failure. */
export function rememberSavedAssessment(
  resultId: string,
  draftKey: string,
  getSessionStorage: () => Pick<Storage, "setItem"> = () => sessionStorage,
  getLocalStorage: () => Pick<Storage, "removeItem"> = () => localStorage,
) {
  try {
    getSessionStorage().setItem("career_last_result_id", resultId);
  } catch {
    /* optional */
  }
  try {
    getLocalStorage().removeItem(draftKey);
  } catch {
    /* optional */
  }
}
