import { ArrowRight, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { FadeUpScroll, WordReveal } from "./ScrollAnimations";

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
          <FadeUpScroll>
            <div>
              <h2 className="cta-title display">Есть<br />задача?</h2>
            </div>
          </FadeUpScroll>
          <div className="cta-copy">
            <WordReveal
              text="Расскажите, какие металлоконструкции нужны вашему проекту. Инженер ответит в течение рабочего дня."
              as="span"
            />
            <br />
            <FadeUpScroll delay={0.2}>
              <button
                className="cta-button"
                onClick={() => { setOpen(true); setSent(false); }}
                data-testid="button-open-contact"
              >
                Обсудить проект <ArrowRight size={16} strokeWidth={1.2} />
              </button>
            </FadeUpScroll>
          </div>
        </div>
      </section>
      <div
        className={`contact-dialog ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}
      >
        <div className="contact-panel">
          <button
            className="contact-close"
            onClick={() => setOpen(false)}
            aria-label="Закрыть форму"
            data-testid="button-close-contact"
          >
            <X size={21} strokeWidth={1.2} />
          </button>
          <h2 className="display">Связаться<br />с нами</h2>
          <p className="contact-hint">Звоните: <a href="tel:+78552202053">8 8552 20-20-53</a> или оставьте заявку:</p>
          {sent ? (
            <p className="form-success">Заявка принята.<br />Менеджер свяжется с вами.</p>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <input required name="name" placeholder="Ваше имя" aria-label="Ваше имя" data-testid="input-contact-name" />
              <input required name="contact" placeholder="Телефон или e-mail" aria-label="Телефон или e-mail" data-testid="input-contact-contact" />
              <textarea name="message" placeholder="Коротко о задаче (вид конструкций, объём, сроки)" aria-label="Коротко о задаче" data-testid="input-contact-message" />
              <button type="submit" data-testid="button-submit-contact">Отправить запрос <ArrowRight size={16} /></button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}