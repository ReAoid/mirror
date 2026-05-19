import { type FormEvent, useEffect, useState } from "react";
import { useSettingsStore } from "../../../stores/settingsStore";
import type { AppSettings, ModelProvider } from "../types";

type SettingsForm = Pick<
  AppSettings,
  | "modelProvider"
  | "modelName"
  | "openaiApiKey"
  | "openaiBaseUrl"
  | "anthropicApiKey"
  | "deepseekApiKey"
  | "deepseekBaseUrl"
  | "temperature"
  | "maxTokens"
>;

const MODEL_PROVIDER_OPTIONS: Array<{ value: ModelProvider; label: string }> = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "deepseek", label: "DeepSeek" },
];

export function SettingsPanel() {
  const settings = useSettingsStore();
  const [form, setForm] = useState<SettingsForm>(() => toForm(settings));
  const [status, setStatus] = useState("");
  const showsBaseUrl = form.modelProvider === "openai" || form.modelProvider === "deepseek";

  useEffect(() => {
    setForm(toForm(settings));
  }, [
    settings.modelProvider,
    settings.modelName,
    settings.openaiApiKey,
    settings.openaiBaseUrl,
    settings.anthropicApiKey,
    settings.deepseekApiKey,
    settings.deepseekBaseUrl,
    settings.temperature,
    settings.maxTokens,
  ]);

  const updateField = <Key extends keyof SettingsForm>(key: Key, value: SettingsForm[Key]) => {
    setStatus("");
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await settings.saveSettings({
      ...form,
      modelName: form.modelName.trim(),
      openaiBaseUrl: form.openaiBaseUrl.trim(),
      deepseekBaseUrl: form.deepseekBaseUrl.trim(),
    });
    setStatus("设置已保存");
  };

  return (
    <form className="settings-panel" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Settings</p>
        <h2>模型设置</h2>
        <p className="muted">保存后，新消息会使用这里的模型配置。</p>
      </div>

      <label>
        <span>模型提供商</span>
        <select
          value={form.modelProvider}
          onChange={(event) => updateField("modelProvider", event.target.value as ModelProvider)}
        >
          {MODEL_PROVIDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>模型名</span>
        <input
          placeholder={getModelPlaceholder(form.modelProvider)}
          type="text"
          value={form.modelName}
          onChange={(event) => updateField("modelName", event.target.value)}
        />
      </label>

      <label>
        <span>API Key</span>
        <input
          autoComplete="off"
          placeholder={getApiKeyPlaceholder(form.modelProvider)}
          type="password"
          value={getApiKeyValue(form)}
          onChange={(event) => setApiKeyValue(updateField, form.modelProvider, event.target.value)}
        />
      </label>

      {showsBaseUrl ? (
        <label>
          <span>Base URL</span>
          <input
            placeholder={getBaseUrlPlaceholder(form.modelProvider)}
            type="url"
            value={getBaseUrlValue(form)}
            onChange={(event) => setBaseUrlValue(updateField, form.modelProvider, event.target.value)}
          />
        </label>
      ) : null}

      <div className="settings-grid">
        <label>
          <span>Temperature</span>
          <input
            max={2}
            min={0}
            step={0.1}
            type="number"
            value={form.temperature}
            onChange={(event) => updateField("temperature", Number(event.target.value))}
          />
        </label>

        <label>
          <span>Max Tokens</span>
          <input
            min={1}
            step={1}
            type="number"
            value={form.maxTokens}
            onChange={(event) => updateField("maxTokens", Number(event.target.value))}
          />
        </label>
      </div>

      <div className="settings-actions">
        <button type="submit">保存设置</button>
        {status ? <span>{status}</span> : null}
      </div>
    </form>
  );
}

function toForm(settings: AppSettings): SettingsForm {
  return {
    modelProvider: settings.modelProvider,
    modelName: settings.modelName,
    openaiApiKey: settings.openaiApiKey,
    openaiBaseUrl: settings.openaiBaseUrl,
    anthropicApiKey: settings.anthropicApiKey,
    deepseekApiKey: settings.deepseekApiKey,
    deepseekBaseUrl: settings.deepseekBaseUrl,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
  };
}

function getModelPlaceholder(provider: ModelProvider): string {
  if (provider === "deepseek") {
    return "deepseek-chat";
  }

  if (provider === "anthropic") {
    return "claude-3-5-sonnet-latest";
  }

  return "gpt-4o-mini";
}

function getApiKeyValue(form: SettingsForm): string {
  if (form.modelProvider === "anthropic") {
    return form.anthropicApiKey;
  }

  if (form.modelProvider === "deepseek") {
    return form.deepseekApiKey;
  }

  return form.openaiApiKey;
}

function setApiKeyValue(
  updateField: <Key extends keyof SettingsForm>(key: Key, value: SettingsForm[Key]) => void,
  provider: ModelProvider,
  value: string,
) {
  if (provider === "anthropic") {
    updateField("anthropicApiKey", value);
    return;
  }

  if (provider === "deepseek") {
    updateField("deepseekApiKey", value);
    return;
  }

  updateField("openaiApiKey", value);
}

function getApiKeyPlaceholder(provider: ModelProvider): string {
  if (provider === "anthropic") {
    return "sk-ant-...";
  }

  return "sk-...";
}

function getBaseUrlValue(form: SettingsForm): string {
  if (form.modelProvider === "deepseek") {
    return form.deepseekBaseUrl;
  }

  return form.openaiBaseUrl;
}

function setBaseUrlValue(
  updateField: <Key extends keyof SettingsForm>(key: Key, value: SettingsForm[Key]) => void,
  provider: ModelProvider,
  value: string,
) {
  if (provider === "deepseek") {
    updateField("deepseekBaseUrl", value);
    return;
  }

  updateField("openaiBaseUrl", value);
}

function getBaseUrlPlaceholder(provider: ModelProvider): string {
  if (provider === "deepseek") {
    return "https://api.deepseek.com/v1";
  }

  return "https://api.openai.com/v1";
}
