import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiAlertTriangle, FiLock } from 'react-icons/fi';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  width: 100%;
  max-width: 560px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(224, 43, 32, 0.18);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.94));

  [data-theme="dark"] & {
    background: linear-gradient(180deg, rgba(20, 20, 20, 0.98), rgba(20, 20, 20, 0.94));
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 0.75rem;
  gap: 1rem;
`;

const TitleWrap = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
`;

const IconBadge = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  box-shadow: 0 10px 22px rgba(224, 43, 32, 0.25);
`;

const Title = styled.div`
  h3 {
    margin: 0;
    color: var(--text);
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  p {
    margin: 0.35rem 0 0;
    color: var(--text-light);
    font-size: 0.95rem;
    line-height: 1.35;
  }
`;

const CloseBtn = styled.button`
  border: none;
  background: transparent;
  color: var(--text-light);
  cursor: pointer;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary);
    background: rgba(224, 43, 32, 0.08);
  }
`;

const Body = styled.div`
  padding: 0 1.25rem 1.25rem;
`;

const WarningBox = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(245, 158, 11, 0.25);
  background: rgba(245, 158, 11, 0.08);
  color: var(--text);
  margin: 0.25rem 0 1rem;

  [data-theme="dark"] & {
    border-color: rgba(245, 158, 11, 0.22);
    background: rgba(245, 158, 11, 0.1);
  }

  .title {
    font-weight: 700;
    margin-bottom: 0.2rem;
  }

  .desc {
    color: var(--text-light);
    font-size: 0.92rem;
    line-height: 1.35;
  }
`;

const Field = styled.div`
  margin-top: 0.75rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text);
    font-weight: 700;
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    border-radius: 14px;
    padding: 0.85rem 0.9rem;
    border: 2px solid rgba(229, 231, 235, 0.9);
    background: white;
    color: var(--text);
    outline: none;
    transition: all 0.2s ease;

    [data-theme="dark"] & {
      background: var(--input-bg);
      border-color: var(--border);
      color: var(--text);
    }

    &:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(224, 43, 32, 0.12);
    }
  }

  .hint {
    margin-top: 0.45rem;
    color: var(--text-light);
    font-size: 0.85rem;
  }
`;

const Footer = styled.div`
  padding: 1rem 1.25rem 1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid rgba(229, 231, 235, 0.8);

  [data-theme="dark"] & {
    border-top-color: rgba(255, 255, 255, 0.08);
  }
`;

const Button = styled(motion.button)`
  border: none;
  cursor: pointer;
  border-radius: 14px;
  padding: 0.85rem 1.05rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  &.secondary {
    background: rgba(107, 114, 128, 0.12);
    color: var(--text);
    border: 1px solid rgba(107, 114, 128, 0.18);

    [data-theme="dark"] & {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.12);
    }
  }

  &.primary {
    color: white;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    box-shadow: 0 12px 26px rgba(224, 43, 32, 0.28);
  }
`;

export default function AdminExportModal({
  open,
  onClose,
  onConfirm,
  title = '导出数据',
  description = '将生成 JSON 文件并下载到本地。',
  confirmText = '开始导出',
  warning = '导出可能包含敏感字段（如 passwordHash、验证码等）。请妥善保存，避免泄露。',
  passwordLabel = '管理员密码（二次验证）'
}) {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => password.trim().length > 0 && !submitting, [password, submitting]);

  const handleClose = () => {
    if (submitting) return;
    setPassword('');
    setError('');
    onClose?.();
  };

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      await onConfirm?.(password);
      setPassword('');
      onClose?.();
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.message ||
        '导出失败，请稍后重试';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <Modal
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <TitleWrap>
                <IconBadge>
                  <FiDownload />
                </IconBadge>
                <Title>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </Title>
              </TitleWrap>
              <CloseBtn onClick={handleClose} aria-label="Close">
                <FiX />
              </CloseBtn>
            </Header>

            <Body>
              <WarningBox>
                <div style={{ marginTop: '2px' }}>
                  <FiAlertTriangle />
                </div>
                <div>
                  <div className="title">敏感数据提示</div>
                  <div className="desc">{warning}</div>
                </div>
              </WarningBox>

              <Field>
                <label>
                  <FiLock />
                  {passwordLabel}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入管理员密码"
                  autoFocus
                />
                <div className="hint">为保护数据安全，需要你再次输入管理员密码。</div>
                {error && (
                  <div style={{ marginTop: '0.6rem', color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>
                    {error}
                  </div>
                )}
              </Field>
            </Body>

            <Footer>
              <Button
                className="secondary"
                onClick={handleClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
              >
                取消
              </Button>
              <Button
                className="primary"
                onClick={handleConfirm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!canSubmit}
              >
                <FiDownload />
                {submitting ? '导出中…' : confirmText}
              </Button>
            </Footer>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

