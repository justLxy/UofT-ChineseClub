import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload, FiAlertTriangle, FiLock, FiFileText } from 'react-icons/fi';

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
  max-width: 620px;
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
    font-weight: 800;
    margin-bottom: 0.2rem;
  }

  .desc {
    color: var(--text-light);
    font-size: 0.92rem;
    line-height: 1.35;
  }
`;

const Section = styled.div`
  margin-top: 0.85rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text);
  font-weight: 800;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
`;

const FileBox = styled.div`
  border: 2px dashed rgba(229, 231, 235, 0.9);
  border-radius: 14px;
  padding: 0.9rem;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;

  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.14);
  }
`;

const Input = styled.input`
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
`;

const RadioRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const RadioCard = styled.button`
  /* Use higher specificity to override global button styles in global.css */
  && {
    border: 1px solid rgba(229, 231, 235, 0.9);
    background: rgba(255, 255, 255, 0.7);
    border-radius: 14px;
    padding: 0.85rem 0.9rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text);
    transform: none;
    box-shadow: none;
  }

  [data-theme="dark"] && {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.12);
  }

  &&:hover {
    background: rgba(224, 43, 32, 0.06);
    border-color: rgba(224, 43, 32, 0.32);
    box-shadow: 0 10px 28px rgba(224, 43, 32, 0.12);
    transform: translateY(-1px);
    color: var(--text);
  }

  [data-theme="dark"] &&:hover {
    background: rgba(224, 43, 32, 0.14);
    border-color: rgba(224, 43, 32, 0.35);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
    color: var(--text);
  }

  &&.active {
    border-color: transparent;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    color: white;
    box-shadow: 0 14px 34px rgba(224, 43, 32, 0.28);
  }

  &&.active:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 44px rgba(224, 43, 32, 0.34);
  }

  .t {
    font-weight: 900;
    margin-bottom: 0.25rem;
  }

  .d {
    color: var(--text-light);
    font-size: 0.88rem;
    line-height: 1.35;
  }

  &&.active .d {
    color: rgba(255, 255, 255, 0.9);
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
  font-weight: 900;
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

export default function AdminImportModal({
  open,
  onClose,
  onImport,
  title = '导入备份（JSON）',
  description = '选择导出的 JSON 文件，将数据恢复到数据库。',
  warning = '导入是高风险操作：如果选择“替换”，会先删除现有数据。请务必先导出一份全量备份并妥善保存。',
  confirmText = '开始导入'
}) {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('merge'); // merge | replace
  const [replaceConfirm, setReplaceConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const canSubmit = useMemo(() => {
    if (!file) return false;
    if (!password.trim()) return false;
    if (submitting) return false;
    if (mode === 'replace' && replaceConfirm.trim().toUpperCase() !== 'REPLACE') return false;
    return true;
  }, [file, password, submitting, mode, replaceConfirm]);

  const handleClose = () => {
    if (submitting) return;
    setFile(null);
    setPassword('');
    setMode('merge');
    setReplaceConfirm('');
    setError('');
    setResult(null);
    onClose?.();
  };

  const handleImport = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    setResult(null);
    try {
      const r = await onImport?.({ file, password, mode });
      setResult(r || { message: '导入成功' });
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || '导入失败，请稍后重试';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose}>
          <Modal
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <Title>
                <h3>{title}</h3>
                <p>{description}</p>
              </Title>
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
                  <div className="title">高风险操作提示</div>
                  <div className="desc">{warning}</div>
                </div>
              </WarningBox>

              <Section>
                <Label>
                  <FiFileText /> 选择 JSON 备份文件
                </Label>
                <FileBox>
                  <div style={{ color: 'var(--text-light)', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {file?.name || '未选择文件'}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept=".json,application/json"
                      style={{ display: 'none' }}
                      id="backup-json-file-input"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <label htmlFor="backup-json-file-input" style={{ cursor: 'pointer', fontWeight: 900, color: 'var(--primary)' }}>
                      选择文件
                    </label>
                  </div>
                </FileBox>
              </Section>

              <Section>
                <Label>
                  <FiUpload /> 导入模式
                </Label>
                <RadioRow>
                  <RadioCard
                    type="button"
                    className={mode === 'merge' ? 'active' : ''}
                    onClick={() => setMode('merge')}
                  >
                    <div className="t">合并（Merge）</div>
                    <div className="d">按主键/唯一键 upsert 写入；适合往现有库补数据（可能遇到冲突）。</div>
                  </RadioCard>
                  <RadioCard
                    type="button"
                    className={mode === 'replace' ? 'active' : ''}
                    onClick={() => setMode('replace')}
                  >
                    <div className="t">替换（Replace）</div>
                    <div className="d">先清空相关表再导入；适合灾难恢复/空库恢复。</div>
                  </RadioCard>
                </RadioRow>
              </Section>

              {mode === 'replace' && (
                <Section>
                  <Label>输入 REPLACE 以确认替换</Label>
                  <Input
                    value={replaceConfirm}
                    onChange={(e) => setReplaceConfirm(e.target.value)}
                    placeholder="REPLACE"
                  />
                </Section>
              )}

              <Section>
                <Label>
                  <FiLock /> 管理员密码（二次验证）
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入管理员密码"
                />
              </Section>

              {error && (
                <div style={{ marginTop: '0.9rem', color: '#ef4444', fontWeight: 900, fontSize: '0.95rem' }}>
                  {error}
                </div>
              )}

              {result?.message && (
                <div style={{ marginTop: '0.9rem', color: '#10b981', fontWeight: 900, fontSize: '0.95rem' }}>
                  {result.message}
                </div>
              )}
            </Body>

            <Footer>
              <Button
                className="secondary"
                onClick={handleClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
              >
                关闭
              </Button>
              <Button
                className="primary"
                onClick={handleImport}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!canSubmit}
              >
                <FiUpload />
                {submitting ? '导入中…' : confirmText}
              </Button>
            </Footer>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

