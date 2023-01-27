let exForm = document.querySelector("#exercise_entry");

exForm.addEventListener("submit", () => {
  const userID = document.querySelector("#_id").value;
  exForm.action = `/api/users/${userID}/exercises`;

  exForm.submit();
})