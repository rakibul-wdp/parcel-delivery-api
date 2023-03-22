exports.getMailTable = (users) => {
  let table = `<table border="1">
    <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone Number</th>
        <th>Hobbies</th>
    </tr>`;
  users.forEach((user) => {
    table += `<tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phoneNumber}</td>
        <td>${user.hobbies.join(", ")}</td>
    </tr>`;
  });
  table += `</table>`;
  return table;
};
