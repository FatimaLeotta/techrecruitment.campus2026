
class Component extends DCLogic {
  // Devuelve el índice de semana activa según la fecha real de hoy.
  // 0 Bienvenida · 1..5 Lecciones · 6 Bonus
  weekFromToday() {
    const hoy = new Date();
    // Lunes de inicio de cada tramo (año 2026)
    const inicios = [
      { i: 1, d: new Date(2026, 7, 3) },   // Lección 1 · 3 ago
      { i: 2, d: new Date(2026, 7, 10) },  // Lección 2 · 10 ago
      { i: 3, d: new Date(2026, 7, 17) },  // Lección 3 · 17 ago
      { i: 4, d: new Date(2026, 7, 24) },  // Lección 4 · 24 ago
      { i: 5, d: new Date(2026, 7, 31) },  // Lección 5 · 31 ago
      { i: 6, d: new Date(2026, 8, 7) },   // Bonus · a partir del 7 sep
    ];
    if (hoy < inicios[0].d) return 0; // antes del arranque → Bienvenida
    let active = 0;
    for (const t of inicios) { if (hoy >= t.d) active = t.i; }
    return active;
  }

  renderVals() {
    const auto = this.weekFromToday();
    // La semana activa se calcula SIEMPRE desde la fecha real de hoy,
    // así "Tu progreso" avanza solo (y cada persona ve su semana correcta).
    const active = auto;

    const meta = [
      { label: 'Inicio', value: '3 de agosto de 2026' },
      { label: 'Finaliza', value: '5 de septiembre de 2026' },
      { label: 'Duración', value: '5 semanas' },
      { label: 'Modalidad', value: 'Grabadas + encuentros en vivo' },
      { label: 'Acceso a grabaciones', value: '6 meses' },
      { label: 'Soporte', value: 'Por WhatsApp' },
      { label: 'Certificado', value: 'De participación' },
      { label: 'Extra', value: 'Bonus de empleabilidad' },
    ];

    const funciona = [
      'Cada lunes se habilita una nueva lección.',
      'Tenés toda la semana para verla a tu ritmo.',
      'Los sábados realizamos el encuentro en vivo.',
      'Los enlaces se habilitan según el calendario.',
      'Las grabaciones permanecen disponibles durante seis meses.',
    ];

    const weeks = [
      { label: 'Bienvenida', tag: 'Lección 0 · Presentación', title: 'Presentación del curso', dates: '3 de agosto', live: 'Sin encuentro en vivo.' },
      { label: 'Lección 1', tag: 'Lección 1 · Módulo 1', title: 'Industria tech: negocios, empresas y cultura', dates: '3 al 7 de agosto', live: 'Sábado 8 de agosto.' },
      { label: 'Lección 2', tag: 'Lección 2 · Módulo 1', title: 'Perfiles Tech', dates: '10 al 14 de agosto', live: 'Sábado 15 de agosto.' },
      { label: 'Lección 3', tag: 'Lección 3 · Módulo 2', title: 'Proceso de contratación: rol, herramientas y etapas', dates: '17 al 21 de agosto', live: 'Sábado 22 de agosto.' },
      { label: 'Lección 4', tag: 'Lección 4 · Módulo 2', title: 'Métricas y buenas prácticas', dates: '24 al 28 de agosto', live: 'Sábado 29 de agosto.' },
      { label: 'Lección 5', tag: 'Lección 5 · Módulo 3', title: 'IA en recruiting y en roles', dates: '31 de agosto al 4 de septiembre', live: 'Viernes 5 de septiembre.' },
      { label: 'Bonus', tag: 'Encuentro Bonus', title: 'Empleabilidad e inserción laboral como IT Recruiter', dates: 'A definir', live: 'A definir.' },
    ];

    const esta = weeks[active] || weeks[1];

    const steps = weeks.map((w, i) => {
      let state, bg, fg, border, icon;
      if (i < active) { state = 'Completado'; bg = 'rgba(55,0,104,0.08)'; fg = '#370068'; border = 'rgba(55,0,104,0.22)'; icon = '✓'; }
      else if (i === active) { state = 'Semana actual'; bg = 'linear-gradient(135deg,#370068,#701B79)'; fg = '#FDFDFD'; border = 'transparent'; icon = '📍'; }
      else { state = 'Pendiente'; bg = '#FDFDFD'; fg = 'rgba(16,17,18,0.55)'; border = 'rgba(16,17,18,0.14)'; icon = '○'; }
      return { label: w.label, state, bg, fg, border, icon };
    });

    const hoy = new Date();
    // helpers to build rows. Cada video puede ser un string (placeholder) o
    // { text, href, unlockAt } — se bloquea hasta unlockAt inclusive.
    const vids = (arr) => arr.map((t, i) => {
      const o = (typeof t === 'string') ? { text: t, href: '#' } : t;
      const locked = o.unlockAt ? (hoy < o.unlockAt) : false;
      const unlockLabel = o.unlockAt
        ? o.unlockAt.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
        : '';
      return {
        n: i + 1, text: o.text, href: o.href || '#',
        locked, unlocked: !locked, unlockLabel,
      };
    });

    const lesson = (fecha, kind, leccion, videos, disponible) => ({
      isLive: false, hasVideos: videos.length > 0, pending: videos.length === 0,
      fecha, kind, leccion, videos: vids(videos), disponible,
      badgeBg: 'rgba(55,0,104,0.1)', badgeFg: '#370068', rowBg: '#FDFDFD',
    });
    const live = (fecha, leccion, disponible, label, href, unlockAt) => {
      const locked = unlockAt ? (hoy < unlockAt) : true; // sin fecha (A definir) → bloqueado
      const unlockLabel = unlockAt
        ? unlockAt.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
        : 'A definir';
      return {
        isLive: true, hasVideos: false, pending: false,
        fecha, kind: 'En vivo', leccion, disponible,
        liveLabel: label || 'Unirse al encuentro en vivo', liveHref: href || '#',
        liveLocked: locked, liveUnlocked: !locked, liveUnlockLabel: unlockLabel,
        badgeBg: 'rgba(112,27,121,0.14)', badgeFg: '#701B79', rowBg: 'rgba(112,27,121,0.035)',
      };
    };

    const groups = [
      { title: 'Presentación', rows: [
        lesson('03/08', 'Lección', 'Lección 0 · Presentación del curso', [
          { text: 'Video de bienvenida', href: 'https://drive.google.com/file/d/16s8buCSnEQK2QQxQlC4K2nElc40KD0Nu/view', unlockAt: new Date(2026, 7, 3) },
        ], '03/08'),
      ]},
      { title: 'Módulo 1 · Industria y Perfiles Tech', rows: [
        lesson('3 al 7 de agosto', 'Lección', 'Lección 1 · Industria tech: negocios, empresas y cultura',
          [
            { text: 'Introducción de la lección', href: 'https://drive.google.com/file/d/1HwcoVdhi2ZGBQH3LHMQO_8JeaX4TXZFF/view', unlockAt: new Date(2026, 7, 3) },
            { text: 'Áreas, sectores y modelos de negocio', href: 'https://drive.google.com/file/d/101jjsd5S1XhM0-aYtl9O9Veouzfcy_jq/view', unlockAt: new Date(2026, 7, 3) },
            { text: 'Tipos de tech company y formas de financiamiento', href: 'https://drive.google.com/file/d/1rvJoNwRu7sGCaGdUx3qjt5tPIMDC0qR-/view', unlockAt: new Date(2026, 7, 3) },
            { text: 'Talento y modalidades de contratación', href: 'https://drive.google.com/file/d/1POgS_7Nf3VpKxqeU5xFfuM7F71eT1XXJ/view', unlockAt: new Date(2026, 7, 3) },
            { text: 'Repaso y próximos pasos', href: 'https://drive.google.com/file/d/1fmDSAOxZ9SXLrGJzSRegaFgc5vdCvF_E/view', unlockAt: new Date(2026, 7, 3) },
          ], '03/08'),
        live('8 de agosto', 'Encuentro 1 · Invitado/a de empresa, negocio o cultura + análisis de mercado', '08/08', 'Acceder a la grabación del encuentro en vivo', 'https://drive.google.com/file/d/1G1-0ivmw8rOw3rvc39J6FyqxZByoBeOZ/view', new Date(2026, 7, 8)),
        lesson('10 al 14 de agosto', 'Lección', 'Lección 2 · Perfiles Tech',
          [
            { text: 'Introducción de la lección', href: 'https://drive.google.com/file/d/1On7s3_Grrhxddvfhu6JlU5DPNmfkQskM/view', unlockAt: new Date(2026, 7, 10) },
            { text: 'Ciclo de Desarrollo de Software y Metodología de Trabajo', href: 'https://drive.google.com/file/d/1fOWstQlCgORPR0H5XVVDC319wSXs-uw5/view', unlockAt: new Date(2026, 7, 10) },
            { text: 'Analista Funcional, Arquitecto de Software y Technical Leader', href: 'https://drive.google.com/file/d/1ozhU3HFCSrkiJ-hTqcc-7GGc2HC0muTD/view', unlockAt: new Date(2026, 7, 10) },
            { text: 'UX/UI Designer y Frontend Developer', href: 'https://drive.google.com/file/d/1ZytoMtnxT9QbzTdUmWsxlf_n0G20ayOk/view', unlockAt: new Date(2026, 7, 10) },
            { text: 'Backend Developer. Recap', href: 'https://drive.google.com/file/d/1_GffUzA02Bu_2RT0Oh5NDpvZjKvOUnp0/view', unlockAt: new Date(2026, 7, 10) },
            { text: 'Tester, DevOps Engineer y Soporte. Career Path', href: 'https://drive.google.com/file/d/1Vdi5IR6_2kBNPT9fXRMbf_Biy-b2foE_/view', unlockAt: new Date(2026, 7, 10) },
          ], '10/08'),
        live('15 de agosto', 'Encuentro 2 · Análisis de job postings', '15/08', 'Acceder a la grabación del encuentro en vivo', 'https://drive.google.com/file/d/16sOKgYS4vwih3RQRyuDWuh5PsqRzQACH/view', new Date(2026, 7, 15)),
      ]},
      { title: 'Módulo 2 · Proceso de Contratación', rows: [
        lesson('17 al 21 de agosto', 'Lección', 'Lección 3 · Proceso de contratación: rol, herramientas y etapas',
          [
            { text: 'Introducción a la lección', href: 'https://drive.google.com/file/d/1JuqhUbIP3_Rzq0EhWfxHFpQTBl5fgOPs/view', unlockAt: new Date(2026, 7, 17) },
            { text: 'Qué es Talent Acquisition', href: 'https://drive.google.com/file/d/1o1BQBm1VWlGIzrI_I5wyj6kmFyFsuzfb/view', unlockAt: new Date(2026, 7, 17) },
            { text: 'Role Profiling: qué buscar y cómo relevarlo', href: 'https://drive.google.com/file/d/1XtGwwZmCHbFflVNxE4hiSciZof-YHS54/view', unlockAt: new Date(2026, 7, 17) },
            { text: 'Sourcing: dónde y cómo buscar', href: 'https://drive.google.com/file/d/16y-WTgL0xmZAHhIjqGFXntWVfxyaB2tV/view', unlockAt: new Date(2026, 7, 17) },
            { text: 'Entrevistas: qué, quién y cuándo entrevistar', href: 'https://drive.google.com/file/d/1J6OH0hUj9nPGjDCSGs29Gpr5oAqJp5hO/view', unlockAt: new Date(2026, 7, 17) },
            { text: 'Talent Discussion y Job Offer: cómo decidir y ofertar', href: 'https://drive.google.com/file/d/1ZnMi_2nbvsM88SBuMheQWiKVzuhorsFk/view', unlockAt: new Date(2026, 7, 17) },
          ], '17/08'),
        live('22 de agosto', 'Encuentro 3 · Simulación de entrevista', '22/08', 'Unirse al encuentro en vivo', 'https://meet.google.com/pwi-rifd-rct', new Date(2026, 7, 22)),
        lesson('24 al 28 de agosto', 'Lección', 'Lección 4 · Métricas y buenas prácticas',
          [
            { text: 'Introducción de la lección', href: 'https://drive.google.com/file/d/1h7tnrwZaaInzcnWMKEove_LF0uiTdeZq/view', unlockAt: new Date(2026, 7, 24) },
            { text: 'Términos base', href: 'https://drive.google.com/file/d/1MoNkIp35yb-qDhVy5QJU1qv2LZK9MhJI/view', unlockAt: new Date(2026, 7, 24) },
            { text: 'Indicadores del Proceso de Contratación', href: 'https://drive.google.com/file/d/1JPZWN4CGHQK9LnokVC8GvDgiuiYhvICg/view', unlockAt: new Date(2026, 7, 24) },
            { text: 'Cuellos de Botella y KPIs de Talent Acquisition', href: 'https://drive.google.com/file/d/1-MxIkuzVW6d1IgQeZXBJimxdeo3_aPhi/view', unlockAt: new Date(2026, 7, 24) },
            { text: 'Reporte de Métricas de Talent Acquisition', href: 'https://drive.google.com/file/d/1SSlBEIia2qZbLGHmbKoWj8hewJVHgjd5/view', unlockAt: new Date(2026, 7, 24) },
          ], '24/08'),
        live('29 de agosto', 'Encuentro 4 · Workshop de construcción de métricas', '29/08', 'Unirse al encuentro en vivo', 'https://meet.google.com/fwp-sbeg-qcr', new Date(2026, 7, 29)),
      ]},
      { title: 'Módulo 3 · IA & Recruitment', rows: [
        lesson('31 de agosto al 4 de septiembre', 'Lección', 'Lección 5 · IA en recruiting y en roles', [], '31/08'),
        live('5 de septiembre', 'Encuentro 5 · Invitado/a sobre IA en HR + análisis de job postings', '05/09', 'Unirse al encuentro en vivo', 'https://meet.google.com/uxz-yvbp-xnf', new Date(2026, 8, 5)),
      ]},
      { title: 'Bonus', rows: [
        live('A definir', 'Encuentro Bonus · Empleabilidad e inserción laboral como IT Recruiter', 'A definir', 'Unirse al encuentro'),
      ]},
    ];

    const rows = [];
    groups.forEach((g) => {
      g.rows.forEach((r, i) => {
        rows.push(Object.assign({}, r, {
          firstOfGroup: i === 0,
          groupSpan: g.rows.length,
          groupTitle: g.title,
        }));
      });
    });

    const recursos = [
      { icon: '💬', title: 'Grupo de WhatsApp', hint: 'Comunidad y soporte diario', href: '#' },
      { icon: '📜', title: 'Certificado de participación', hint: 'Al finalizar el curso', href: '#' },
      { icon: '🎥', title: 'Grabaciones de los encuentros', hint: 'Disponibles durante 6 meses', href: '#' },
    ];

    return { meta, funciona, esta, steps, rows, recursos };
  }
}
