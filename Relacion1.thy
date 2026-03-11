theory Relacion1
imports Main
begin

section "Introducción: Lógica Proposicional"

text "
  --------------------------------------------------------------------------
  EJERCICIOS RESUELTOS - RELACIÓN 1
  
  Este archivo contiene la formalización y verificación automática de
  argumentos lógicos clásicos.
  
  Símbolos ASCII utilizados (Atajos de teclado):
  -->  : Implicación (Si... entonces)
  &    : Conjunción (Y)
  |    : Disyunción (O)
  ~    : Negación (No)
  =    : Equivalencia (Si y solo si) *Cuidado con los paréntesis*
  --------------------------------------------------------------------------
"

section "Ejercicios de Formalización"

text "
  --------------------------------------------------------------------------
  Ejercicio 01
  --------------------------------------------------------------------------
  Enunciado:
  Si Juan es andaluz entonces Juan es europeo. Efectivamente, Juan es andaluz.
  Por lo tanto, Juan es europeo.
  
  Simbolización:
  A: Juan es andaluz
  E: Juan es europeo
  
"

lemma ejercicio_01:
  assumes "A --> E"
      and "A"
    shows "E"
  using assms by auto

text "
  --------------------------------------------------------------------------
  Ejercicio 02
  --------------------------------------------------------------------------
  Enunciado:
  Cuando tanto la temperatura como la presión atmosférica permanecen
  constantes, no llueve. La temperatura permanece constante. Por lo tanto, en 
  caso de que llueva, la presión atmosférica no permanece constante.
  
  Simbolización:
  T: La temperatura permanece constante
  P: La presión atmosférica permanece constante
  L: Llueve
  
  Nota: Aquí se utiliza la contrapositiva. Si (T y P) implica No L, entonces
  si ocurre L (Llueve), no pueden estar ocurriendo (T y P) a la vez. Como T
  es verdad, P debe ser falso.
"

lemma ejercicio_02:
  assumes "(T & P) --> ~L"
      and "T"
    shows "L --> ~P"
  using assms by auto

text "
  --------------------------------------------------------------------------
  Ejercicio 03
  --------------------------------------------------------------------------
  Enunciado:
  Siempre que un número x es divisible por 10, acaba en 0. El número x no acaba
  en 0. Por lo tanto, x no es divisible por 10.
  
  Simbolización:
  D: El número es divisible por 10
  C: El número acaba en cero
  
  Nota: Ejemplo clásico de 'Modus Tollens' (Si A implica B, y B es falso,
  entonces A es falso).
"

lemma ejercicio_03:
  assumes "D --> C"
      and "~C"
    shows "~D"
  using assms by auto

text "
  --------------------------------------------------------------------------
  Ejercicio 04
  --------------------------------------------------------------------------
  Enunciado:
  En cierto experimento, cuando hemos empleado un fármaco A, el paciente ha
  mejorado considerablemente en el caso, y sólo en el caso, en que no se haya
  empleado también un fármaco B. Además, o se ha empleado el fármaco A o se ha
  empleado el fármaco B. En consecuencia, podemos afirmar que si no hemos 
  empleado el fármaco B, el paciente ha mejorado considerablemente.
  
  Simbolización:
  A: Hemos empleado el fármaco A
  B: Hemos empleado el fármaco B
  M: El paciente ha mejorado notablemente
  
  Nota: La expresión 'en el caso y solo en el caso' indica una doble implicación
  o equivalencia (=). Cuidado con los paréntesis al formalizarla.
"

lemma ejercicio_04:
  assumes "A --> (M = (~B))"
      and "A | B"
    shows "~B --> M"
  using assms by auto

text "Comprobación extra del Ejercicio 4 (Búsqueda de contraejemplo):"

(* Nota: Añadimos paréntesis extra para que el '=' no confunda a Isabelle.
   Quickcheck encontrará un contraejemplo porque la lógica NO ES ASOCIATIVA!
   de la manera planteada aquí. *)
lemma ej4_extra:
  "((A --> M) = (~B)) = (A --> (M = (~B)))" 
  quickcheck
oops (* 'oops' cierra la prueba fallida para continuar *)

text "
  --------------------------------------------------------------------------
  Ejercicio 05
  --------------------------------------------------------------------------
  Enunciado:
  Si no está el mañana ni el ayer escrito, entonces no está el mañana escrito.
  
  Simbolización:
  M: El mañana está escrito
  A: El ayer está escrito
  
  Nota: Esto es una tautología lógica básica. Si no hay ni M ni A, obviamente
  no hay M.
"

lemma ejercicio_05:
  assumes "~M & ~A"
    shows "~M"
  using assms by auto

text "
  --------------------------------------------------------------------------
  Ejercicio 06
  --------------------------------------------------------------------------
  Enunciado:
  Me matan si no trabajo y si trabajo me matan. Me matan siempre me matan.
  
  Simbolización:
  M: Me matan
  T: Trabajo
  
  Nota: Análisis por casos (Dilema constructivo). Sea T verdadero o falso,
  la conclusión M siempre se cumple.
"

lemma ejercicio_06:
  assumes "(~T --> M) & (T --> M)"
    shows "M"
  using assms by auto

text "
  --------------------------------------------------------------------------
  Ejercicio 07
  --------------------------------------------------------------------------
  Enunciado:
  Si te llamé por teléfono, entonces recibiste mi llamada y no es cierto que no
  te avisé del peligro que corrías. Por consiguiente, como te llamé, es cierto
  que te avisé del peligro que corrías.
  
  Simbolización:
  T: Te llamé por teléfono
  R: Recibiste mi llamada
  P: Te avisé del peligro que corrías
  
  Nota: 'No es cierto que no te avisé' es una doble negación (~(~P)), que en
  lógica clásica equivale a P.
"

lemma ejercicio_07:
  assumes "T --> (R & ~(~P))"
      and "T"
    shows "P"
  using assms by auto

text "
  --------------------------------------------------------------------------
  Ejercicio 08
  --------------------------------------------------------------------------
  Enunciado:
  Si no hay control de nacimientos, entonces la población crece ilimitadamente;
  pero si la población crece ilimitadamente, aumentará el índice de pobreza.
  Por consiguiente, si no hay control de nacimientos, aumentará el índice de
  pobreza.
  
  Simbolización:
  N: Hay control de nacimientos
  P: La población crece ilimitadamente
  I: Aumentará el índice de pobreza
  
  Nota: Regla de la cadena o Silogismo Hipotético. Si A -> B y B -> C,
  entonces A -> C.
"

lemma ejercicio_08:
  assumes "~N --> P"
      and "P --> I"
    shows "~N --> I"
  using assms by auto

text "
  --------------------------------------------------------------------------
  Ejercicio 09
  --------------------------------------------------------------------------
  Enunciado:
  Si el general fuera leal habría cumplido las órdenes, y si fuera inteligente
  las habría entendido. O el general no cumplió las órdenes o no las entendió.
  Luego, el general era desleal o no era inteligente.
  
  Simbolización:
  L: El general es leal
  C: El general cumple las órdenes
  I: El general es inteligente
  E: El general entiende las órdenes
  
  Nota: Dilema destructivo. Tenemos dos implicaciones y sabemos que uno de los
  consecuentes es falso, por lo tanto, uno de los antecedentes debe ser falso.
"

lemma ejercicio_09:
  assumes "L --> C"
      and "I --> E"
      and "~C | ~E"
    shows "~L | ~I"
  using assms by auto

text "
  --------------------------------------------------------------------------
  Ejercicio 10 (El problema de Zeus)
  --------------------------------------------------------------------------
  Enunciado:
  Si Zeus fuera capaz de evitar el mal y quisiera hacerlo, lo haría. Si Zeus
  fuera incapaz de evitar el mal, no sería omnipotente; si no quisiera evitar
  el mal sería malévolo. Zeus no evita el mal. Si Zeus existe, es omnipotente
  y no es malévolo. Luego, Zeus no existe.
  
  Simbolización:
  C: Zeus es capaz de evitar el mal
  Q: Zeus quiere evitar el mal
  Om: Zeus es omnipotente
  M: Zeus es malévolo
  P: Zeus evita el mal
  E: Zeus existe
  
  Nota: Este es un argumento complejo de reducción al absurdo. Si asumimos que
  Zeus existe, llegamos a contradicciones con las premisas sobre su naturaleza
  y el hecho de que no evita el mal.
"

lemma ejercicio_10:
  assumes "(C & Q) --> P"
      and "~C --> ~Om"
      and "~Q --> M"
      and "~P"
      and "E --> (Om & ~M)"
    shows "~E"
  using assms by auto

text "
  --------------------------------------------------------------------------
  Ejercicio 11
  --------------------------------------------------------------------------
  Enunciado:
  Nadie más que Pedro, Quintín y Raúl están bajo sospecha y al menos uno es
  traidor. Si Quintín es el traidor entonces lleva al menos un cómplice (que
  puede ser Pedro o Raúl). Raúl es leal. Por lo tanto, Pedro es traidor.
  
  Simbolización:
  P: Pedro es traidor
  Q: Quintín es traidor
  R: Raúl es traidor
  
  Nota: Un proceso de eliminación. R es falso. Si Q fuera verdad, P o R serían
  verdad. Como R es falso, si Q fuera verdad, P sería verdad. Pero también,
  si Q es falso, P debe ser verdad (porque al menos uno lo es).
"

lemma ejercicio_11:
  assumes "P | Q | R"
      and "Q --> (P | R)"
      and "~R"
    shows "P"
  using assms by auto

text "
  --------------------------------------------------------------------------
  Ejercicio 12
  --------------------------------------------------------------------------
  Enunciado:
  Si la válvula está abierta o la monitorización está preparada, entonces se
  envía una señal de reconocimiento y un mensaje de funcionamiento al
  controlador del ordenador. Si se envía un mensaje de funcionamiento al
  controlador del ordenador o el sistema está en estado normal, entonces se
  aceptan las órdenes del operador. Por lo tanto, si la válvula está abierta,
  entonces se aceptan las órdenes del operador.
  
  Simbolización:
  A: La válvula está abierta
  P: La monitorización está preparada
  R: Envía una señal de reconocimiento
  F: Envía un mensaje de funcionamiento
  N: El sistema está en estado normal
  Or: Se aceptan órdenes del operador
"

lemma ejercicio_12:
  assumes "(A | P) --> (R & F)"
      and "(F | N) --> Or"
    shows "A --> Or"
  using assms by auto

text "
  --------------------------------------------------------------------------
  Ejercicio 13
  --------------------------------------------------------------------------
  Enunciado:
  Si trabajo gano dinero, pero si no trabajo gozo de la vida. Sin embargo, si
  trabajo no gozo de la vida, mientras que si no trabajo no gano dinero. Por
  lo tanto, gozo de la vida si y sólo si no gano dinero.
  
  Simbolización:
  T: Trabajo
  D: Gano dinero
  V: Gozo de la vida
  
  Nota: Aquí demostramos una equivalencia lógica (doble implicación) partiendo
  de varias implicaciones contradictorias entre el trabajo y el disfrute.
"

lemma ejercicio_13:
  assumes "T --> D"
      and "~T --> V"
      and "T --> ~V"
      and "~T --> ~D"
    shows "V = (~D)" 
  using assms by auto

section "Problema Extra: Veraces y Mentirosos"

text "
  --------------------------------------------------------------------------
  Problema de la Isla (Veraces y Mentirosos)
  --------------------------------------------------------------------------
  Enunciado:
  En una isla hay veraces (siempre dicen verdad) y mentirosos (siempre mienten).
  Tres habitantes (A, B, C) dicen:
  
  A dice: 'B y C son veraces si y solo si C es veraz'.
  B dice: 'Si A y C son veraces, entonces B y C son veraces y A es mentiroso'.
  C dice: 'B es mentiroso si y solo si A o B es veraz'.
  
  NOTA: Usamos Mayúsculas (A, B, C) para las variables proposicionales para
  evitar errores de sintaxis en Isabelle.
  A = True significa 'A es veraz'.
"

text "1. Intento de refutar (comprobamos si las afirmaciones son imposibles):"
lemma intento_falso:
  assumes "A = ((B & C) = C)"
      and "B = ((A & C) --> (B & C & ~A))" 
      and "C = ((~B) = (A | B))"
    shows "False"
  quickcheck
oops (* Quickcheck encuentra solución, no es imposible, así que continuamos *)

text "2. Solución correcta encontrada por Quickcheck (A=True, B=True, C=False):"

lemma solucion_veraces:
  assumes "A = ((B & C) = C)"
      and "B = ((A & C) --> (B & C & ~A))" 
      and "C = ((~B) = (A | B))"
    shows "A & B & ~C"
  using assms by auto

end