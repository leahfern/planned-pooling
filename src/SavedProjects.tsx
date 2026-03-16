import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { getSaves, saveProject, deleteSave } from './hooks/useSavedProjects';
import { HOOK_NEEDLE_SIZES, STITCH_TYPES, INPUT_LIMITS } from './constants/projectMetadata';
import type { AppParams, SavedProject } from './types';

const ButtonGroup = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.small};
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: ${(props) => props.theme.spacing.small} ${(props) => props.theme.spacing.medium};
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
  input, select, textarea {
    width: 100%;
    padding: ${(props) => props.theme.spacing.small};
    font-size: ${(props) => props.theme.fontSizes.medium};
    border: 1px solid ${(props) => props.theme.colors.grey};
    border-radius: 4px;
    box-sizing: border-box;
  }
  textarea {
    min-height: 60px;
    resize: vertical;
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
  &:last-child { border-bottom: none; }
`;

const ListItemInfo = styled.div`
  flex: 1;
  min-width: 0;
  strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  span { font-size: ${(props) => props.theme.fontSizes.small}; color: ${(props) => props.theme.colors.grey}; }
`;

const SmallButton = styled.button`
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  &:hover { filter: brightness(1.1); }
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

interface CurrentProject {
  id: string;
  name: string;
  author: string;
}

interface SavedProjectsProps {
  params: AppParams;
  setParams: (p: AppParams) => void;
  defaultParams: AppParams;
  currentProject: CurrentProject | null;
  setCurrentProject: (p: CurrentProject | null) => void;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

function SavedProjects({
  params,
  setParams,
  defaultParams,
  currentProject,
  setCurrentProject,
  showToast,
}: SavedProjectsProps) {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveAuthor, setSaveAuthor] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saves, setSaves] = useState<SavedProject[]>(getSaves());

  const refreshSaves = useCallback(() => setSaves(getSaves()), []);

  const handleOpenSave = () => {
    setSaveName(currentProject?.name || '');
    setSaveAuthor(currentProject?.author || '');
    setSaveError('');
    setSaveModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    const name = saveName?.trim() || 'Untitled';
    const author = saveAuthor?.trim() || '';
    const existing = getSaves().find(
      (s) => s.name?.trim().toLowerCase() === name.toLowerCase() && s.id !== currentProject?.id
    );
    if (existing) {
      setSaveError('A project with this name already exists. Please choose a different name.');
      return;
    }
    const saved = saveProject({ name, author, params, id: currentProject?.id });
    setCurrentProject({ id: saved.id, name: saved.name, author: saved.author });
    setSaveModalOpen(false);
    showToast?.(currentProject?.id ? 'Project updated' : 'Project saved');
  };

  const handleOpenList = () => {
    refreshSaves();
    setListModalOpen(true);
  };

  const handleLoad = (save: SavedProject) => {
    setParams({ ...defaultParams, ...save.params });
    setCurrentProject({ id: save.id, name: save.name, author: save.author || '' });
    setListModalOpen(false);
    showToast?.('Project loaded');
  };

  const handleDelete = (id: string) => {
    deleteSave(id);
    if (currentProject?.id === id) setCurrentProject(null);
    refreshSaves();
    showToast?.('Project deleted');
  };

  return (
    <>
      <ButtonGroup>
        <Button type="button" onClick={handleOpenSave}>
          {currentProject?.id ? 'Update project' : 'Save project'}
        </Button>
        <Button type="button" onClick={handleOpenList}>My projects</Button>
        {currentProject?.id && (
          <Button type="button" onClick={() => { setCurrentProject(null); setParams(defaultParams); showToast?.('New project started'); }}>New project</Button>
        )}
      </ButtonGroup>

      {saveModalOpen && (
        <Overlay onClick={() => setSaveModalOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{currentProject?.id ? 'Update project' : 'Save project'}</ModalTitle>
            <form onSubmit={handleSaveSubmit}>
              {saveError && <SaveError>{saveError}</SaveError>}
              <Field>
                <label htmlFor="save-name">Project name</label>
                <input id="save-name" type="text" value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="e.g. My Scarf Pattern" maxLength={INPUT_LIMITS.projectName} autoFocus />
              </Field>
              <Field>
                <label htmlFor="save-author">Author (optional)</label>
                <input id="save-author" type="text" value={saveAuthor} onChange={(e) => setSaveAuthor(e.target.value)} placeholder="Your name" maxLength={INPUT_LIMITS.author} />
              </Field>
              <Field>
                <label htmlFor="hook-needle">Hook / needle size (optional)</label>
                <select id="hook-needle" value={params.hookNeedleSize ?? ''} onChange={(e) => setParams({ ...params, hookNeedleSize: e.target.value })}>
                  {HOOK_NEEDLE_SIZES.map((opt) => <option key={opt.value || 'empty'} value={opt.value}>{opt.label}</option>)}
                </select>
              </Field>
              {params.hookNeedleSize === 'other' && (
                <Field>
                  <label htmlFor="hook-needle-other">Hook / needle size (other)</label>
                  <input id="hook-needle-other" type="text" value={params.hookNeedleSizeOther ?? ''} onChange={(e) => setParams({ ...params, hookNeedleSizeOther: e.target.value })} placeholder="e.g. 3 mm" maxLength={INPUT_LIMITS.hookNeedleOther} />
                </Field>
              )}
              <Field>
                <label htmlFor="stitch-type">Stitch type (optional)</label>
                <select id="stitch-type" value={params.stitchType ?? ''} onChange={(e) => setParams({ ...params, stitchType: e.target.value })}>
                  {STITCH_TYPES.map((opt) => <option key={opt.value || 'empty'} value={opt.value}>{opt.label}</option>)}
                </select>
              </Field>
              {params.stitchType === 'other' && (
                <Field>
                  <label htmlFor="stitch-type-other">Stitch type (other)</label>
                  <input id="stitch-type-other" type="text" value={params.stitchTypeOther ?? ''} onChange={(e) => setParams({ ...params, stitchTypeOther: e.target.value })} placeholder="e.g. Lemon peel" maxLength={INPUT_LIMITS.stitchTypeOther} />
                </Field>
              )}
              <Field>
                <label htmlFor="lot-number">Lot number (optional)</label>
                <input id="lot-number" type="text" value={params.lotNumber ?? ''} onChange={(e) => setParams({ ...params, lotNumber: e.target.value })} placeholder="Yarn lot/dye lot" maxLength={INPUT_LIMITS.lotNumber} />
              </Field>
              <Field>
                <label htmlFor="notes">Notes (optional)</label>
                <textarea id="notes" value={params.notes ?? ''} onChange={(e) => setParams({ ...params, notes: e.target.value })} placeholder="Gauge, yardage, pattern notes…" maxLength={INPUT_LIMITS.notes} />
              </Field>
              <ModalActions>
                <Button type="button" onClick={() => setSaveModalOpen(false)}>Cancel</Button>
                <Button type="submit">{currentProject?.id ? 'Update' : 'Save'}</Button>
              </ModalActions>
            </form>
          </Modal>
        </Overlay>
      )}

      {listModalOpen && (
        <Overlay onClick={() => setListModalOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>My projects</ModalTitle>
            {saves.length === 0 ? (
              <EmptyMessage>No saved projects yet. Save one to see it here.</EmptyMessage>
            ) : (
              <List>
                {saves.map((save) => (
                  <ListItem key={save.id}>
                    <ListItemInfo>
                      <strong>{save.name}</strong>
                      {save.author && <span>{save.author}</span>}
                      <span>{new Date(save.savedAt).toLocaleDateString()}</span>
                    </ListItemInfo>
                    <SmallButton type="button" onClick={() => handleLoad(save)}>Load</SmallButton>
                    <SmallButton type="button" className="secondary" onClick={() => handleDelete(save.id)}>Delete</SmallButton>
                  </ListItem>
                ))}
              </List>
            )}
            <ModalActions>
              <Button type="button" onClick={() => setListModalOpen(false)}>Close</Button>
            </ModalActions>
          </Modal>
        </Overlay>
      )}
    </>
  );
}

export default SavedProjects;
