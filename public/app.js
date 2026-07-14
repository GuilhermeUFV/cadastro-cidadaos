"use strict";

const registerForm = document.querySelector("#register-form");
const searchForm = document.querySelector("#search-form");
const registerResult = document.querySelector("#register-result");
const searchResult = document.querySelector("#search-result");
const cpfInput = document.querySelector("#cpf");

function formatCpf(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function setButtonLoading(button, isLoading, loadingText) {
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
    return;
  }

  button.textContent = button.dataset.originalText;
  button.disabled = false;
}

function clearResult(container) {
  container.replaceChildren();
  container.classList.add("hidden");
  container.classList.remove("success", "error");
}

function showMessage(container, message, type) {
  clearResult(container);

  const paragraph = document.createElement("p");
  paragraph.textContent = message;
  paragraph.style.margin = "0";

  container.appendChild(paragraph);
  container.classList.add(type);
  container.classList.remove("hidden");
}

function createCitizenCard(citizen) {
  const card = document.createElement("article");
  card.className = "citizen";

  const name = document.createElement("strong");
  name.textContent = citizen.fullName;

  const cpf = document.createElement("span");
  cpf.textContent = `CPF: ${formatCpf(citizen.cpf)}`;

  card.append(name, cpf);

  return card;
}

function showCitizens(container, message, citizens) {
  clearResult(container);

  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messageElement.style.marginTop = "0";

  const list = document.createElement("div");
  list.className = "result-list";

  for (const citizen of citizens) {
    list.appendChild(createCitizenCard(citizen));
  }

  container.append(messageElement, list);
  container.classList.add("success");
  container.classList.remove("hidden");
}

async function readResponse(response) {
  try {
    return await response.json();
  } catch {
    return {
      message: "O servidor retornou uma resposta inesperada.",
    };
  }
}

cpfInput.addEventListener("input", () => {
  cpfInput.value = formatCpf(cpfInput.value);
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearResult(registerResult);

  const button = registerForm.querySelector("button");
  const formData = new FormData(registerForm);

  const payload = {
    fullName: formData.get("fullName"),
    cpf: formData.get("cpf"),
  };

  setButtonLoading(button, true, "Cadastrando...");

  try {
    const response = await fetch("/api/citizens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(data.message ?? "Não foi possível cadastrar o cidadão.");
    }

    showCitizens(registerResult, data.message, [data.citizen]);
    registerForm.reset();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível cadastrar o cidadão.";

    showMessage(registerResult, message, "error");
  } finally {
    setButtonLoading(button, false);
  }
});

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearResult(searchResult);

  const button = searchForm.querySelector("button");
  const formData = new FormData(searchForm);
  const query = String(formData.get("query") ?? "").trim();

  setButtonLoading(button, true, "Pesquisando...");

  try {
    const parameters = new URLSearchParams({
      query,
    });

    const response = await fetch(`/api/citizens?${parameters.toString()}`);
    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(data.message ?? "Não foi possível realizar a pesquisa.");
    }

    const total = data.citizens.length;
    const message =
      total === 1
        ? "1 cidadão encontrado."
        : `${total} cidadãos encontrados.`;

    showCitizens(searchResult, message, data.citizens);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível realizar a pesquisa.";

    showMessage(searchResult, message, "error");
  } finally {
    setButtonLoading(button, false);
  }
});
