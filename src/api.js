const BASE = "http://127.0.0.1:5000";

export async function getClasses() {
  const res = await fetch(`${BASE}/api/classes`);
  return res.json();
}

export async function addClass(data) {
  const res = await fetch(`${BASE}/api/classes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export async function deleteClass(id) {
  const res = await fetch(`${BASE}/api/classes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export async function updateClass(id, data) {
  const res = await fetch(`${BASE}/api/classes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}
