'use client';
import { useEffect, useRef, useState } from 'react';
import { FaEnvelope, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useTranslation } from '../hooks/useTranslation';

type Props = { variant: 'section' | 'inline'; onSuccess?: () => void };
type Status = 'idle' | 'submitting' | 'success' | 'error' | 'rate-limited';

// How long the success icon lingers before the card turns back into a form
// (so a visitor can send a second message without a reload).
const SUCCESS_REVERT_MS = 4000;

const MessageForm = ({ onSuccess }: Props) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // Honeypot — real visitors never see or fill this field (see .mf-hp in theme.css).
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const revertTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(revertTimerRef.current), []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || status === 'submitting') return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, company }),
      });
      if (res.status === 429) {
        setStatus('rate-limited');
        return;
      }
      if (!res.ok) {
        setStatus('error');
        return;
      }
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      onSuccess?.();
      revertTimerRef.current = setTimeout(() => setStatus('idle'), SUCCESS_REVERT_MS);
    } catch {
      setStatus('error');
    }
  };

  if (status !== 'idle') {
    const isSubmitting = status === 'submitting';
    const isSuccess = status === 'success';
    const Icon = isSubmitting ? FaEnvelope : isSuccess ? FaCheckCircle : FaExclamationCircle;
    const text =
      status === 'submitting' ? t('messageSending')
        : status === 'success' ? t('messageSuccess')
          : status === 'rate-limited' ? t('messageRateLimited')
            : t('messageError');

    return (
      <div className="mf-feedback" data-status={status}>
        <span className="mf-feedback-icon"><Icon size={28} /></span>
        <p className="mf-status">{text}</p>
        {!isSubmitting && !isSuccess && (
          <button type="button" className="chip" onClick={() => setStatus('idle')}>
            {t('messageTryAgain')}
          </button>
        )}
      </div>
    );
  }

  return (
    <form className="message-form" onSubmit={submit}>
      <input
        className="mf-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('messageNamePlaceholder')}
        aria-label={t('messageNamePlaceholder')}
        autoComplete="name"
      />
      <input
        className="mf-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('messageEmailPlaceholder')}
        aria-label={t('messageEmailPlaceholder')}
        autoComplete="email"
      />
      <textarea
        className="mf-textarea"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t('messagePlaceholder')}
        aria-label={t('messagePlaceholder')}
        rows={4}
        required
      />

      {/* Honeypot: a real (not type="hidden") field, visually hidden via CSS.
          Bots that indiscriminately fill every input still get caught. */}
      <div className="mf-hp" aria-hidden="true">
        <label htmlFor="mf-company">Company</label>
        <input
          id="mf-company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <button type="submit" className="chip" disabled={!message.trim()}>
        {t('messageSend')}
      </button>
    </form>
  );
};

export default MessageForm;
