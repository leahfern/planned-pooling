import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { getSavedYarns, saveYarn, deleteYarn } from './hooks/useSavedYarns';
import { INPUT_LIMITS } from './constants/projectMetadata';
import type { AppParams, SavedYarn } from './types';

const ButtonGroup = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.small};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const Button = styled.button`
  padding: ${(props) => props.theme.spacing.small}
    ${(props) => props.theme.spacing.medium};
  font-size: ${(props) => props.theme.fontSizes.small};
  cursor: pointer;
  border: none;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  transition: filter 0.2s ease;
  &:hover {
    filter: brightness(1.1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: ${(props) => props.theme.colors.cardBg || props.theme.colors.white};
  padding: ${(props) => props.theme.spacing.large};
  border-radius: 8px;
  min-width: 320px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h3`
  margin: 0 0 ${(props) => props.theme.spacing.medium};
  font-family: ${(props) => props.theme.fonts.secondary};
  font-size: ${(props) => props.theme.fontSizes.large};
`;

const Field = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.medium};
  label {
    display: block;
    margin-bottom: ${(props) => props.theme.spacing.small};
    font-size: ${(props) => props.theme.fontSizes.small};
    color: ${(props) => props.theme.colors.grey};
  }
  input {
    width: 100%;
    padding: ${(props) => props.theme.spacing.small};
    font-size: ${(props) => props.theme.fontSizes.medium};
    border: 1px solid ${(props) => props.theme.colors.grey};
    border-radius: 4px;
    box-sizing: border-box;
  }
`;

const SaveError = styled.p`
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.fontSizes.small};
  margin: 0 0 ${(props) => props.theme.spacing.medium};
  padding: ${(props) => props.theme.spacing.small};
  background: rgba(0, 128, 128, 0.08);
  border-radius: 4px;
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.small};
  margin-top: ${(props) => props.theme.spacing.large};
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.small} 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.grey};
  gap: ${(props) => props.theme.spacing.small};
  &:last-child {
    border-bottom: none;
  }
`;

const ListItemInfo = styled.div`
  flex: 1;
  min-width: 0;
  strong {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const SmallButton = styled.button`
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  &:hover {
    filter: brightness(1.1);
  }
  &.secondary {
    background: transparent;
    color: ${(props) => props.theme.colors.grey};
    border: 1px solid ${(props) => props.theme.colors.grey};
  }
`;

const EmptyMessage = styled.p`
  color: ${(props) => props.theme.colors.grey};
  font-size: ${(props) => props.theme.fontSizes.small};
  margin: 0;
`;

function sameYarn(
  a: { brand?: string; name?: string; colorway?: string },
  b: { brand?: string; name?: string; colorway?: string }
): boolean {
  const n = (s: string | undefined) => (s ?? '').trim().toLowerCase();
  return (
    n(a.brand) === n(b.brand) &&
    n(a.name) === n(b.name) &&
    n(a.colorway) === n(b.colorway)
  );
}

interface SavedYarnsProps {
  params: AppParams;
  setParams: (p: AppParams) => void;
  showToast?: (message: string) => void;
}

function SavedYarns({ params, setParams, showToast }: SavedYarnsProps) {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [saveBrand, setSaveBrand] = useState('');
  const [saveName, setSaveName] = useState('');
  const [saveColorway, setSaveColorway] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saves, setSaves] = useState<SavedYarn[]>(getSavedYarns());

  const refreshSaves = useCallback(() => setSaves(getSavedYarns()), []);

  const handleOpenSave = () => {
    setSaveBrand('');
    setSaveName('');
    setSaveColorway('');
    setSaveError('');
    setSaveModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    const brand = saveBrand?.trim() ?? '';
    const name = saveName?.trim() ?? '';
    const colorway = saveColorway?.trim() ?? '';
    if (!brand && !name && !colorway) return;
    const candidate = { brand, name, colorway };
    const existing = getSavedYarns().find((y) => sameYarn(y, candidate));
    if (existing) {
      setSaveError('This yarn is already saved. Use "My yarns" to load it.');
      return;
    }
    saveYarn({
      brand,
      name,
      colorway,
      colorSequence: params?.colorSequence ?? [],
    });
    setSaveModalOpen(false);
    showToast?.('Yarn saved');
  };

  const handleOpenLoad = () => {
    refreshSaves();
    setLoadModalOpen(true);
  };

  const handleLoad = (yarn: SavedYarn) => {
    setParams({
      ...params,
      yarnBrand: yarn.brand,
      yarnName: yarn.name,
      yarnColorway: yarn.colorway,
      colorSequence:
        Array.isArray(yarn.colorSequence) && yarn.colorSequence.length > 0
          ? yarn.colorSequence
          : (params?.colorSequence ?? []),
    });
    setLoadModalOpen(false);
    showToast?.('Yarn loaded');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this yarn from your saved list?')) {
      deleteYarn(id);
      refreshSaves();
      showToast?.('Yarn removed');
    }
  };

  const yarnLabel = (y: SavedYarn) =>
    [y.brand, y.name, y.colorway].filter(Boolean).join(' — ') || 'Unnamed yarn';

  return (
    <>
      <ButtonGroup>
        <Button type="button" onClick={handleOpenSave}>
          Save yarn
        </Button>
        <Button type="button" onClick={handleOpenLoad}>
          My yarns
        </Button>
      </ButtonGroup>

      {saveModalOpen && (
        <Overlay onClick={() => setSaveModalOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Save yarn</ModalTitle>
            <form onSubmit={handleSaveSubmit}>
              {saveError && <SaveError>{saveError}</SaveError>}
              <Field>
                <label htmlFor="yarn-brand">Yarn brand</label>
                <input
                  id="yarn-brand"
                  type="text"
                  value={saveBrand}
                  onChange={(e) => setSaveBrand(e.target.value)}
                  placeholder="e.g. Red Heart"
                  maxLength={INPUT_LIMITS.yarnBrand}
                />
              </Field>
              <Field>
                <label htmlFor="yarn-name">Yarn name</label>
                <input
                  id="yarn-name"
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="e.g. Super Saver"
                  maxLength={INPUT_LIMITS.yarnName}
                />
              </Field>
              <Field>
                <label htmlFor="yarn-colorway">Colorway</label>
                <input
                  id="yarn-colorway"
                  type="text"
                  value={saveColorway}
                  onChange={(e) => setSaveColorway(e.target.value)}
                  placeholder="e.g. Cherry Red"
                  maxLength={INPUT_LIMITS.yarnColorway}
                />
              </Field>
              <ModalActions>
                <Button type="button" onClick={() => setSaveModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !saveBrand?.trim() &&
                    !saveName?.trim() &&
                    !saveColorway?.trim()
                  }
                >
                  Save
                </Button>
              </ModalActions>
            </form>
          </Modal>
        </Overlay>
      )}

      {loadModalOpen && (
        <Overlay onClick={() => setLoadModalOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>My yarns</ModalTitle>
            {saves.length === 0 ? (
              <EmptyMessage>
                No saved yarns yet. Save a yarn to see it here.
              </EmptyMessage>
            ) : (
              <List>
                {saves.map((yarn) => (
                  <ListItem key={yarn.id}>
                    <ListItemInfo>
                      <strong title={yarnLabel(yarn)}>{yarnLabel(yarn)}</strong>
                    </ListItemInfo>
                    <SmallButton type="button" onClick={() => handleLoad(yarn)}>
                      Load
                    </SmallButton>
                    <SmallButton
                      type="button"
                      className="secondary"
                      onClick={() => handleDelete(yarn.id)}
                    >
                      Remove
                    </SmallButton>
                  </ListItem>
                ))}
              </List>
            )}
            <ModalActions>
              <Button type="button" onClick={() => setLoadModalOpen(false)}>
                Close
              </Button>
            </ModalActions>
          </Modal>
        </Overlay>
      )}
    </>
  );
}

export default SavedYarns;
