import React from 'react';
import styled from 'styled-components';
import { HOOK_NEEDLE_SIZES, STITCH_TYPES } from './constants/projectMetadata';
import type { AppParams } from './types';

const Strip = styled.div`
  width: 100%;
  flex-shrink: 0;
  background: ${(props) => props.theme.colors.cardBg || props.theme.colors.white};
  padding: ${(props) => props.theme.spacing.medium} ${(props) => props.theme.spacing.large};
  border-left: 4px solid ${(props) => props.theme.colors.primary};
  border-bottom: 1px solid ${(props) => props.theme.colors.grey};
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
`;

const Inner = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.div`
  font-size: ${(props) => props.theme.fontSizes.medium};
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  font-family: ${(props) => props.theme.fonts.secondary};
  margin-bottom: ${(props) => props.theme.spacing.small};
  letter-spacing: 0.02em;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${(props) => props.theme.spacing.small} 0;
  font-size: ${(props) => props.theme.fontSizes.small};
  color: ${(props) => props.theme.colors.text};
  line-height: 1.5;
`;

const Field = styled.span`
  display: inline-flex;
  align-items: baseline;
  .label {
    color: ${(props) => props.theme.colors.grey};
    margin-right: 4px;
    font-size: ${(props) => props.theme.fontSizes.small};
  }
`;

const Sep = styled.span`
  color: ${(props) => props.theme.colors.grey};
  margin: 0 ${(props) => props.theme.spacing.small};
  font-weight: 300;
  user-select: none;
`;

const NotesBlock = styled.div`
  margin-top: ${(props) => props.theme.spacing.small};
  padding-top: ${(props) => props.theme.spacing.small};
  border-top: 1px solid ${(props) => props.theme.colors.grey};
  font-size: ${(props) => props.theme.fontSizes.small};
  color: ${(props) => props.theme.colors.text};
  .label {
    color: ${(props) => props.theme.colors.grey};
    display: block;
    margin-bottom: 2px;
  }
`;

function safeTrim(value: string | number | null | undefined): string {
  if (value == null) return '';
  return String(value).trim();
}

function formatHookNeedle(params: AppParams): string {
  const v = params.hookNeedleSize ?? '';
  if (v === 'other') return safeTrim(params.hookNeedleSizeOther) || '—';
  const opt = HOOK_NEEDLE_SIZES.find((o) => o.value === v);
  return opt ? opt.label : (v || '—');
}

function formatStitchType(params: AppParams): string {
  const v = params.stitchType ?? '';
  if (v === 'other') return safeTrim(params.stitchTypeOther) || '—';
  const opt = STITCH_TYPES.find((o) => o.value === v);
  return opt ? opt.label : (v || '—');
}

interface CurrentProject {
  id: string;
  name: string;
  author: string;
}

interface ProjectDetailsProps {
  currentProject: CurrentProject | null;
  params: AppParams;
}

function ProjectDetails({ currentProject, params }: ProjectDetailsProps) {
  if (!currentProject) return null;

  const hookNeedle = formatHookNeedle(params);
  const stitchType = formatStitchType(params);
  const lot = safeTrim(params.lotNumber);
  const notes = safeTrim(params.notes);
  const yarnBrand = safeTrim(params.yarnBrand);
  const yarnName = safeTrim(params.yarnName);
  const yarnColorway = safeTrim(params.yarnColorway);
  const yarnLine = [yarnBrand, yarnName, yarnColorway].filter(Boolean).join(' — ') || null;

  const hasFields = currentProject.author || hookNeedle !== '—' || stitchType !== '—' || lot || notes || yarnLine;
  const fields = [
    currentProject.author && { label: 'Author', value: currentProject.author },
    hookNeedle !== '—' && { label: 'Hook/needle', value: hookNeedle },
    stitchType !== '—' && { label: 'Stitch type', value: stitchType },
    lot && { label: 'Lot', value: lot },
    yarnLine && { label: 'Yarn', value: yarnLine },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Strip>
      <Inner>
        <Title>{currentProject.name || 'Untitled project'}</Title>
        {hasFields && (
          <>
            <Row>
              {fields.map((item, i) => (
                <span key={item.label}>
                  {i > 0 && <Sep>·</Sep>}
                  <Field><span className="label">{item.label}:</span>{item.value}</Field>
                </span>
              ))}
            </Row>
            {notes && (
              <NotesBlock>
                <span className="label">Notes</span>
                {notes}
              </NotesBlock>
            )}
          </>
        )}
      </Inner>
    </Strip>
  );
}

export default ProjectDetails;
