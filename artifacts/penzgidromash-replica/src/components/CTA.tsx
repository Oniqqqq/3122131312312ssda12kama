import { ArrowUpRight, X } from "lucide-react";
import { FormEvent, useState } from "react";

export function CTA() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <>
      <section className="cta" data-testid="section-cta">
        <div className="container cta-inner">
          <div><div className="eyebrow">07 / следующий шаг</div><h2 className="cta-title display">Есть<br />задача?</h2></div>
          <div className="cta-copy">Расскажите, какое оборудование нужно вашему производству. Инженер ответит в течение рабочего дня.<br /><button className="cta-button" onClick={() => { setOpen(true); setSent(false); }} data-testid="button-open-contact">Обсудить проект <ArrowUpRight size={16} strokeWidth={1.2} /></button></div>
        </div>
      </section>
      <div className={`contact-dialog ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!open} onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        <div className="contact-panel">
          <button className="contact-close" onClick={() => setOpen(false)} aria-label="Закрыть форму" data-testid="button-close-contact"><X size={21} strokeWidth={1.2} /></button>
          <div className="eyebrow">запрос / 08</div>
          <h2 className="display">Связаться<br />с нами</h2>
          {sent ? <p className="form-success">Заявка принята.<br />Инженер свяжется с вами.</p> : <form className="contact-form" onSubmit={submit}>
            <input required name="name" placeholder="Ваше имя" aria-label="Ваше имя" data-testid="input-contact-name" />
            <input required name="contact" placeholder="Телефон или e-mail" aria-label="Телефон или e-mail" data-testid="input-contact-contact" />
            <textarea name="message" placeholder="Коротко о задаче" aria-label="Коротко о задаче" data-testid="input-contact-message" />
            <button type="submit" data-testid="button-submit-contact">Отправить запрос →</button>
          </form>}
        </div>
      </div>
    </>
  );
}