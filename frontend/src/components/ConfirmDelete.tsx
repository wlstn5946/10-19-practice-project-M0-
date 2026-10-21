type Props = {
  name: string
  busy: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDelete({ name, busy, onConfirm, onCancel }: Props) {
  return (
    <div role="alertdialog" aria-label="삭제 확인">
      <p>
        '{name}' 기록을 삭제할까요? 삭제하면 되돌릴 수 없습니다.
      </p>
      <button type="button" onClick={onConfirm} disabled={busy}>
        삭제
      </button>{' '}
      <button type="button" onClick={onCancel} disabled={busy}>
        취소
      </button>
    </div>
  )
}
