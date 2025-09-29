import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: "#2584ff",
    secondary: "#00d9ff",
    accent: "#ff3400",
    headings: "#1b0760",
    body: "#918ca4",
    bodyDarker: "#5c5577",
    border: "#ccc",
  },
  radii: {
    button: "40px",
    input: "var(--border-radius)",
  },
  fontSizes: {
    sm: "1.6rem",
    md: "2rem",
    lg: "2.4rem",
    xl: "3rem",
    "2xl": "4rem",
    "3xl": "5rem",
    "4xl": "6rem",
    "5xl": "8rem",
    "6xl": "10rem",
  },
  fonts: {
    body: "Inter, Arial, Helvetica, sans-serif",
    color: "red",
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 600,
  },
  textStyles: {
    tagline: {
      fontSize: "2rem",
      color: "var(--color-body-darker)", // Adjust as needed
      letterSpacing: "1px",
      margin: "2rem 0 5rem",
    },
  },
  styles: {
    global: {
      ":root": {
        "--color-primary": "#2584ff",
        "--color-secondary": "#00d9ff",
        "--color-accent": "#ff3400",
        "--color-headings": "#1b0760",
        "--color-body": "#918ca4",
        "--color-body-darker": "#5c5577",
        "--color-border": "#ccc",
        "--border-radius": "30px",
      },
      "*": {
        boxSizing: "border-box",
      },
      "*::after": {
        boxSizing: "border-box",
      },
      "*::before": {
        boxSizing: "border-box",
      },
      "::selection": {
        background: "var(--color-primary)",
        color: "#fff",
      },
      html: {
        fontSize: "62.5%",
      },
      body: {
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
        fontSize: "2rem",
        lineHeight: 1.5,
        color: "var(--color-body)",
      },
      "h1, h2, h3": {
        color: "var(--color-headings)",
        marginBottom: "1rem",
        lineHeight: 1.1,
      },
      h1: {
        fontSize: "6rem",
      },
      h2: {
        fontSize: "4rem",
      },
      h3: {
        fontSize: "2.8rem",
        fontWeight: 600,
        lineHeight: 1.3,
      },
      p: {
        marginTop: 0,
      },
      "@media screen and (min-width: 1024px)": {
        body: {
          fontSize: "1.8rem",
        },
        h1: {
          fontSize: "8rem",
        },
        h2: {
          fontSize: "4rem",
        },
        h3: {
          fontSize: "2.4rem",
        },
      },
      a: {
        textDecoration: "none",
      },
      ".link-arrow": {
        color: "var(--color-accent)",
        textTransform: "uppercase",
        fontSize: "2rem",
        fontWeight: "bold",
      },
      ".link-arrow::after": {
        content: '"-->"',
        marginLeft: "5px",
        transition: "margin 0.15s",
      },
      ".link-arrow:hover::after": {
        marginLeft: "10px",
      },
      "@media screen and (min-width: 1024px)": {
        ".link-arrow": {
          fontSize: "1.5rem",
        },
      },
      ".badge": {
        borderRadius: "20px",
        fontSize: "2rem",
        fontWeight: "600",
        padding: "0.5rem 2rem",
        whiteSpace: "nowrap",
      },
      ".badge--primary": {
        background: "var(--color-primary)",
        color: "#fff",
      },
      ".badge--secondary": {
        background: "var(--color-secondary)",
        color: "#fff",
      },
      ".badge--small": {
        fontSize: "1.6rem",
        padding: "0.5rem 1.5rem",
      },
      "@media screen and (min-width: 1024px)": {
        ".badge": {
          fontSize: "1.5rem",
        },
        ".badge--small": {
          fontSize: "1.2rem",
        },
      },
      ".list": {
        listStyle: "none",
        paddingLeft: 0,
      },
      ".list--inline .list__item": {
        display: "inline-block",
        marginRight: "2rem",
      },
      ".list--tick": {
        listStyleImage: "url(./assets/images/tick.svg)",
        paddingLeft: "3rem",
        color: "var(--color-headings)",
      },
      ".list--tick .list__item": {
        paddingLeft: "0.5rem",
        marginBottom: "1rem",
      },
      "@media screen and (min-width: 1024px)": {
        ".list--tick .list__item": {
          paddingLeft: 0,
        },
      },
      ".icon": {
        width: "40px",
        height: "40px",
      },
      ".icon--small": {
        width: "30px",
        height: "30px",
      },
      ".icon--primary": {
        fill: "var(--color-primary)",
      },
      ".icon--white": {
        fill: "#fff",
      },
      ".icon-container": {
        background: "#f3f9fa",
        width: "64px",
        height: "64px",
        borderRadius: "100%",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
      },
      ".icon-container--accent": {
        background: "var(--color-accent)",
      },
      ".btn": {
        borderRadius: "40px",
        border: 0,
        cursor: "pointer",
        fontSize: "1.8rem",
        fontWeight: 600,
        margin: "1rem 0",
        outline: 0,
        padding: "2rem 4vw",
        textAlign: "center",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      },
      ".btn .icon": {
        width: "2rem",
        height: "2rem",
        marginRight: "1rem",
        verticalAlign: "middle",
      },
      ".btn--primary": {
        background: "var(--color-primary)",
        color: "#fff",
      },
      ".btn--primary:hover": {
        background: "#3a8ffd",
      },
      ".btn--secondary": {
        background: "var(--color-secondary)",
        color: "#fff",
      },
      ".btn--secondary:hover": {
        background: "#05cdf0",
      },
      ".btn--accent": {
        background: "var(--color-accent)",
        color: "#fff",
      },
      ".btn--accent:hover": {
        background: "#ec3000",
      },
      ".btn--outline": {
        background: "#fff",
        color: "var(--color-headings)",
        border: "2px solid var(--color-headings)",
      },
      ".btn--outline:hover": {
        background: "var(--color-headings)",
        color: "#fff",
      },
      ".btn--stretched": {
        paddingLeft: "6rem",
        paddingRight: "6rem",
      },
      ".btn--block": {
        width: "100%",
        display: "inline-block",
      },
      "@media screen and (min-width: 1024px)": {
        ".btn": {
          fontSize: "1.5rem",
        },
      },
      ".input": {
        borderRadius: "var(--border-radius)",
        border: "1px solid var(--color-border)",
        color: "var(--color-headings)",
        fontSize: "2rem",
        outline: 0,
        padding: "1.5rem 3.5rem",
      },
      "::placeholder": {
        color: "#cdcbd7",
      },
      ".input-group": {
        border: "1px solid var(--color-border)",
        borderRadius: "var(--border-radius)",
        display: "flex",
      },
      ".input-group .input": {
        border: 0,
        flexGrow: 1,
        padding: "1.5rem 2rem",
        width: 0,
      },
      ".input-group .btn": {
        margin: "4px",
      },
      "@media screen and (min-width: 1024px)": {
        ".input": {
          fontSize: "1.5rem",
        },
      },
      ".card": {
        borderRadius: "7px",
        boxShadow: "0 0 20px 10px #f3f3f3",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      },
      ".card__header, .card__body": {
        padding: "2rem 7%",
      },
      ".card--primary .card__header": {
        background: "var(--color-primary)",
        color: "#fff",
      },
      ".card--secondary .card__header": {
        background: "var(--color-secondary)",
        color: "#fff",
      },
      ".card--primary .badge--primary": {
        background: "#126de4",
      },
      ".card--secondary .badge--secondary": {
        background: "#02cdf1",
      },
      ".plan": {
        transition: "transform 0.2s ease-out",
      },
      ".plan__name": {
        color: "#fff",
        margin: 0,
        fontWeight: 500,
        fontSize: "2.4rem",
      },
      ".plan__price": {
        fontSize: "5rem",
      },
      ".plan__billing-cycle": {
        fontSize: "2rem",
        fontWeight: 300,
        opacity: 0.8,
        marginRight: "1rem",
      },
      ".plan__description": {
        fontSize: "2rem",
        fontWeight: 300,
        letterSpacing: "1px",
        display: "block",
      },
      ".plan .list__item": {
        marginBottom: "2rem",
      },
      ".plan--popular .card__header": {
        position: "relative",
      },
      ".plan--popular .card__header::before": {
        content: "url(./assets/images/popular.svg)",
        width: "40px",
        display: "inline-block",
        position: "absolute",
        top: "-6px",
        right: "5%",
      },
      ".plan:hover": {
        transform: "scale(1.05)",
      },
      ".plan--popular:hover": {
        transform: "scale(1.15)",
      },
      "@media screen and (min-width: 1024px)": {
        ".plan--popular": {
          transform: "scale(1.1)",
        },
        ".plan__name": {
          fontSize: "1.4rem",
        },
        ".plan__price": {
          fontSize: "5rem",
        },
        ".plan__billing-cycle": {
          fontSize: "1.6rem",
        },
        ".plan__description": {
          fontSize: "1.7rem",
        },
      },
      ".media": {
        display: "flex",
        marginBottom: "4rem",
      },
      ".media__title": {
        marginTop: 0,
      },
      ".media__body": {
        margin: "0 2rem",
      },
      ".media__image": {
        marginTop: "1rem",
      },
      ".quote": {
        fontSize: "3rem",
        fontStyle: "italic",
        color: "var(--color-body-darker)",
        lineHeight: 1.3,
      },
      ".quote__text::before": {
        content: "open-quote",
      },
      ".quote__text::after": {
        content: "close-quote",
      },
      ".quote__author": {
        fontSize: "2rem",
        fontWeight: 500,
        fontStyle: "normal",
        marginBottom: 0,
      },
      ".quote__organization": {
        color: "var(--color-headings)",
        opacity: 0.4,
        fontSize: "1.5rem",
        fontStyle: "normal",
      },
      ".quote__line": {
        position: "relative",
        bottom: "10px",
      },
      "@media screen and (min-width: 1024px)": {
        ".quote": {
          fontSize: "2rem",
        },
        ".quote__author": {
          fontSize: "2.4rem",
        },
        ".quote__organization": {
          fontSize: "1.6rem",
        },
      },
      ".grid": {
        display: "grid",
      },
      "@media screen and (min-width: 768px)": {
        ".grid--1x2": {
          gridTemplateColumns: "repeat(2, 1fr)",
        },
      },
      "@media screen and (min-width: 1024px)": {
        ".grid--1x3": {
          gridTemplateColumns: "repeat(3, 1fr)",
        },
      },
      ".testimonial": {
        padding: "3rem",
      },
      ".testimonial .quote": {
        margin: "2rem 0",
        fontSize: "110%",
      },
      ".testimonial__image": {
        position: "relative",
        margin: "0 3rem",
      },
      ".testimonial__image>.icon-container": {
        position: "absolute",
        top: "3rem",
        right: "-32px",
      },
      "@media screen and (min-width: 768px)": {
        ".testimonial__image": {
          margin: 0,
        },
        ".testimonial .quote": {
          margin: "5rem 0 0 6rem",
          fontSize: "120%",
          lineHeight: 1.5,
        },
      },
      ".callout": {
        padding: "4rem",
        borderRadius: "5px",
      },
      ".callout--primary": {
        background: "var(--color-primary)",
        color: "#fff",
      },
      ".callout__heading": {
        color: "#fff",
        marginTop: 0,
        fontSize: "3rem",
      },
      ".callout .btn": {
        justifySelf: "center",
        alignSelf: "center",
      },
      ".callout__content": {
        textAlign: "center",
      },
      "@media screen and (min-width: 768px)": {
        ".callout .grid--1x2": {
          gridTemplateColumns: "1fr auto",
        },
        ".callout__content": {
          textAlign: "left",
        },
        ".callout .btn": {
          justifySelf: "start",
          margin: "0 2rem",
        },
      },
      ".collapsible__header": {
        display: "flex",
        justifyContent: "space-between",
      },
      ".collapsible__heading": {
        marginTop: 0,
        fontSize: "3rem",
      },
      ".collapsible__chevron": {
        transform: "rotate(-90deg)",
        transition: "transform 0.3s",
      },
      ".collapsible__content": {
        maxHeight: 0,
        overflow: "hidden",
        opacity: 0,
        transition: "all 0.3s",
      },
      ".collapsible--expanded .collapsible__chevron": {
        transform: "rotate(0)",
      },
      ".collapsible--expanded .collapsible__content": {
        maxHeight: "100%",
        opacity: 1,
      },
      ".block": {
        "--padding-vertical": "5rem",
        padding: "var(--padding-vertical) 2rem",
      },
      ".block__header": {
        textAlign: "center",
        marginBottom: "4rem",
      },
      ".block__heading": {
        marginTop: 0,
      },
      ".block--dark": {
        background: "#000",
        color: "#7b858b",
      },
      ".block--dark h1, .block--dark h2, .block--dark h3": {
        color: "#fff",
      },
      ".block--skewed-right": {
        paddingBottom: "calc(var(--padding-vertical) + 4rem)",
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 95%)",
      },
      ".block--skewed-left": {
        paddingBottom: "calc(var(--padding-vertical) + 4rem)",
        clipPath: "polygon(0% 0%, 100% 0%, 100% 95%, 0% 100%)",
      },
      ".container": {
        maxWidth: "1140px",
        margin: "0 auto",
      },
      ".nav": {
        background: "#000",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        padding: "1rem",
        alignItems: "center",
      },
      ".nav__list": {
        width: "100%",
        margin: 0,
      },
      ".nav__item": {
        padding: "0.5rem 2rem",
        borderBottom: "1px solid #222",
      },
      ".nav__item:last-of-type": {
        borderBottom: "none",
      },
      ".nav__item>a": {
        color: "#d2d0db",
        transition: "color 0.3s",
      },
      ".nav__item>a:hover": {
        color: "#fff",
      },
      ".nav__toggler": {
        opacity: 0.5,
        transition: "box-shadow 0.15s",
        cursor: "pointer",
      },
      ".nav.collapsible--expanded .nav__toggler": {
        opacity: 1,
        boxShadow: "0 0 0 3px #666",
        borderRadius: "5px",
      },
      ".nav__brand": {
        transform: "translateY(5px)",
        width: "150px",
      },
      "@media screen and (min-width: 768px)": {
        ".nav__toggler": {
          display: "none",
        },
        ".nav__list": {
          width: "auto",
          display: "flex",
          fontSize: "1.6rem",
          maxHeight: "100%",
          opacity: 1,
        },
        ".nav__item": {
          border: 0,
        },
      },
      ".hero__tagline": {
        fontSize: "2rem",
        color: "#b9c3cf",
        letterSpacing: "1px",
        margin: "2rem 0 5rem",
      },
      "@media screen and (min-width: 768px)": {
        ".hero__content": {
          textAlign: "left",
          alignSelf: "center",
        },
      },
      "@media screen and (min-width: 1024px)": {
        ".hero": {
          paddingTop: 0,
        },
      },
      ".block-domain .input-group": {
        boxShadow: "0 0 30px 20px #e6ebee",
        border: 0,
        margin: "4rem auto",
        maxWidth: "670px",
      },
      ".block-domain__prices": {
        color: "var(--color-headings)",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(2, 6rem)",
        fontSize: "2rem",
        fontWeight: 600,
        justifyItems: "center",
        maxWidth: "700px",
        margin: "0 auto",
      },
      "@media screen and (min-width: 768px)": {
        ".block-domain__prices": {
          gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
        },
      },
      ".block-plans .grid": {
        gap: "8rem 4rem",
      },
      ".block-plans .card": {
        maxWidth: "500px",
        margin: "0 auto",
      },
      ".feature": {
        gap: "4rem 2rem",
        margin: "12rem 0",
      },
      ".feature:first-of-type": {
        marginTop: "6rem",
      },
      ".feature__heading": {
        margin: "1rem 0",
      },
      "@media screen and (min-width: 768px)": {
        ".feature:nth-of-type(even) .feature__content": {
          order: 2,
        },
      },
      "@media screen and (min-width: 768px)": {
        ".block-showcase .grid": {
          gridTemplateColumns: "50% 50%",
        },
        ".block-showcase__image": {
          justifySelf: "end",
        },
        ".block-showcase__image > img": {
          width: "auto",
          maxWidth: "700px",
        },
      },
      ".footer": {
        background: "#232323",
        paddingTop: "10rem",
      },
      ".footer a": {
        color: "#777",
        transition: "color 0.3s",
      },
      ".footer a:hover": {
        color: "#fff",
      },
      ".footer__section": {
        padding: "2rem",
        borderBottom: "1px solid #393939",
      },
      ".footer__section .list": {
        margin: 0,
      },
      ".footer__heading": {
        textTransform: "uppercase",
        fontWeight: 600,
        fontSize: "2.5rem",
        lineHeight: 1.5,
      },
      ".footer__brand": {
        marginTop: "5rem",
        textAlign: "center",
      },
      ".footer__brand img": {
        maxWidth: "230px",
      },
      ".footer__copyright": {
        fontSize: "2.1rem",
        color: "#fff",
        opacity: 0.3,
      },
      "@media screen and (min-width: 768px)": {
        ".footer": {
          fontSize: "1.5rem",
        },
        ".footer__sections": {
          gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
        },
        ".footer .collapsible__chevron": {
          display: "none",
        },
        ".footer .collapsible__content": {
          opacity: 1,
          maxHeight: "100%",
        },
        ".footer__brand": {
          order: -1,
          marginTop: "1rem",
        },
        ".footer__copyright": {
          fontSize: "1.5rem",
        },
        ".footer__section": {
          border: 0,
        },
        ".footer__heading": {
          fontSize: "1.6rem",
        },
      },
      ".callout-signup": {
        transform: "translateY(5rem)",
      },
    },
  },
});

export default theme;
