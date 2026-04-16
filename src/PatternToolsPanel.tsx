import { useMemo } from 'react';
import styled from 'styled-components';
import type { ColorSequenceItem } from './types';
import { buildWrittenPattern, getRepeatBlockSize } from './utils/writtenPattern';

const Panel = styled.section`
  width: 100%;
  max-width: 720px;
  margin: 24px auto 0;
  padding: ${(p) => p.theme.spacing?.large || '16px'};
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.grey};
  background: ${(p) => p.theme.colors.cardBg || p.theme.colors.surface || '#fff'};
  box-sizing: border-box;
`;

const Title = styled.h2`
  margin: 0 0 12px;
  font-size: 1.1rem;
  color: ${(p) => p.theme.colors.text};
`;

const Muted = styled.p`
  margin: 0 0 12px;
  font-size: 0.9rem;
  color: ${(p) => p.theme.colors.grey};
`;

const PatternList = styled.div`
  width: 100%;
  min-height: 160px;
  max-height: 280px;
  overflow: auto;
  padding: 12px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  line-height: 1.4;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.grey};
  background: ${(p) => p.theme.colors.surface || '#fafafa'};
  color: ${(p) => p.theme.colors.text};
  box-sizing: border-box;
`;

const PatternLine = styled.div<{ $active?: boolean }>`
  padding: 3px 6px;
  border-radius: 6px;
  background: ${(p) => (p.$active ? 'rgba(56, 132, 255, 0.16)' : 'transparent')};
  font-weight: ${(p) => (p.$active ? 700 : 400)};
`;

const RepeatNote = styled.p`
  margin: 10px 0 0;
  font-size: 0.9rem;
  color: ${(p) => p.theme.colors.grey};
`;

const TrackerRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
`;

const BigLabel = styled.span`
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`;

interface PatternToolsPanelProps {
  length: number;
  height: number;
  colorSequence: ColorSequenceItem[];
  stitchPattern: string;
  currentRow: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
}

export default function PatternToolsPanel({
  length,
  height,
  colorSequence,
  stitchPattern,
  currentRow,
  onPrev,
  onNext,
  onReset,
}: PatternToolsPanelProps) {
  const patternDisplay = useMemo(() => {
    const rows = buildWrittenPattern(length, height, colorSequence, stitchPattern);
    const repeatBlockSize = getRepeatBlockSize(rows);
    const displayRows = repeatBlockSize ? rows.slice(0, repeatBlockSize) : rows;
    const activeInstructionRow = repeatBlockSize
      ? ((currentRow - 1) % repeatBlockSize) + 1
      : currentRow;
    return {
      rows: displayRows,
      repeatBlockSize,
      activeInstructionRow,
    };
  }, [length, height, colorSequence, stitchPattern, currentRow]);

  const rowTrackerHint = useMemo(() => {
    if (!patternDisplay.repeatBlockSize) return null;
    if (currentRow <= patternDisplay.repeatBlockSize) return null;
    return `Current row ${currentRow} follows row ${patternDisplay.activeInstructionRow} in the repeated block.`;
  }, [currentRow, patternDisplay.activeInstructionRow, patternDisplay.repeatBlockSize]);

  return (
    <Panel>
      <Title>Written pattern</Title>
      <Muted>Matches the grid (including back-and-forth). Copy for your notes or Ravelry.</Muted>
      <PatternList aria-label="Written pattern">
        {patternDisplay.rows.map((row) => (
          <PatternLine
            key={row.rowNumber}
            $active={row.rowNumber === patternDisplay.activeInstructionRow}
          >
            Row {row.rowNumber}: {row.line}
          </PatternLine>
        ))}
      </PatternList>
      {patternDisplay.repeatBlockSize && (
        <RepeatNote>
          Repeat rows 1-{patternDisplay.repeatBlockSize} until desired length is reached
        </RepeatNote>
      )}
      {rowTrackerHint && <RepeatNote>{rowTrackerHint}</RepeatNote>}

      <Title style={{ marginTop: 20 }}>Row tracker</Title>
      <Muted>Tap +/− while you work. The grid highlights the row you&apos;re on.</Muted>
      <TrackerRow>
        <BigLabel>
          Row {currentRow} / {height}
        </BigLabel>
        <button type="button" onClick={onPrev} disabled={currentRow <= 1}>
          −
        </button>
        <button type="button" onClick={onNext} disabled={currentRow >= height}>
          +
        </button>
        <button type="button" onClick={onReset}>
          Reset to row 1
        </button>
      </TrackerRow>
    </Panel>
  );
}
