import { useEffect, useState } from "react";
import "./App.css";
import DataSubjects from "./data.json";

interface Unit {
  title: string;
  specificCompetency: string;
  weeks: string;
  learningOutcome: string;
  knowledge: string;
  skill: string;
}

interface Data {
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  option5: string;
  option6: string;
  textArea1: string;
  textArea2: string;
  units: Unit[];
}

const LOCAL_STORAGE_KEY = "formData";

function App() {
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [option5, setOption5] = useState("");
  const [option6, setOption6] = useState("");
  const [textArea1, setTextArea1] = useState("");
  const [textArea2, setTextArea2] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [totalSkill, setTotalSkill] = useState(0);
  const [totalKnowledge, setTotalKnowledge] = useState(0);
  const [totalWeeks, setTotalWeeks] = useState(0);
  const [formData, setFormData] = useState<Data[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);
  console.log(formData.length);

  useEffect(() => {
    if (formData.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  const select1Options = ["Seleccione..."];
  DataSubjects.forEach((subject) =>
    subject.area.forEach((area) => {
      if (!select1Options.some((option) => option === area.name)) {
        select1Options.push(area.name);
      }
    })
  );
  const select2Options = ["Seleccione..."];
  if (option1 !== "Seleccione...") {
    DataSubjects.forEach((subject) => {
      if (subject.area.some((area) => area.name === option1)) {
        select2Options.push(subject.subjectname);
      }
    });
  }
  const select3Options = ["Seleccione...", "1er", "2do", "3er", "4to", "5to", "6to"];
  const select4Options = ["Seleccione...", "1", "2", "3", "4", "5"];

  const select5Options = ["Seleccione..."];
  if (option2 && option2 !== "Seleccione...") {
    DataSubjects.find((subject) => {
      if (subject.subjectname === option2) {
        subject.professor.forEach((p) => select5Options.push(p.name));
      }
    });
  }

  const select6Options = ["Seleccione..."];
  if (option2 && option2 !== "Seleccione...") {
    DataSubjects.find((subject) => {
      if (subject.subjectname === option2) select6Options.push(subject.durationHours.toString());
    });
  }

  useEffect(() => {
    if (option1 === "Seleccione..." || option2 === "Seleccione..." || !option1 || !option2) {
      setOption3("");
      setOption4("");
      setOption5("");
      setOption6("");
      setTextArea1("");
      setTextArea2("");
      setUnits([]);
    }
  }, [option1, option2]);
  useEffect(() => {
    if (option1 === "Seleccione..." || !option1) {
      setOption2("");
    }
  }, [option1]);

  useEffect(() => {
    if (option4 && option4 !== "Seleccione...") {
      const newUnits = Array.from({ length: parseInt(option4) }, (_, index) => ({
        title: units[index]?.title || "",
        specificCompetency: units[index]?.specificCompetency || "",
        weeks: units[index]?.weeks || "",
        learningOutcome: units[index]?.learningOutcome || "",
        knowledge: units[index]?.knowledge || "",
        skill: units[index]?.skill || "",
      }));
      setUnits(newUnits);
    } else {
      setUnits([]); // Si se vuelve a seleccionar "Seleccione...", limpiamos el estado
    }
  }, [option4]);

  const handleChange = (index: number, field: keyof (typeof units)[0], value: string) => {
    if (field === "weeks" && Number(value) > 10) return;
    if ((field === "knowledge" || field === "skill") && (Number(value) < 0 || Number(value) > 100)) return;

    const updatedUnits = [...units];
    updatedUnits[index] = { ...updatedUnits[index], [field]: value };

    const totalWeeks = updatedUnits.reduce((sum, unit) => sum + (Number(unit.weeks) || 0), 0);

    // Validar que la suma de "knowledge" y "skill" no supere 100%
    const totalKnowledge = updatedUnits.reduce((sum, unit) => sum + (Number(unit.knowledge) || 0), 0);
    const totalSkill = updatedUnits.reduce((sum, unit) => sum + (Number(unit.skill) || 0), 0);

    if (field !== "weeks" && totalKnowledge + totalSkill > 100) return; // Evitar superar el 100%
    setTotalWeeks(totalWeeks);
    setTotalKnowledge(totalKnowledge);
    setTotalSkill(totalSkill);
    setUnits(updatedUnits);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isEmptyOption = [option1, option2, option3, option4, option5, option6].includes("Seleccione...");
    const isEmptyTextArea = !textArea1 || !textArea2;
    const isEmptyUnits = units.some((unit) => Object.values(unit).some((value) => !value));

    if (isEmptyOption || isEmptyTextArea || isEmptyUnits) {
      alert("Por favor, selecciona todas las opciones");
      return;
    }

    const data: Data = { option1, option2, option3, option4, option5, option6, textArea1, textArea2, units };

    try {
      // Obtener los datos previos de localStorage
      const storedData: Data[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");

      // Agregar el nuevo dato al array
      const updatedData = [...storedData, data];

      // Guardar en localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));

      // Actualizar el estado
      setFormData(updatedData);

      console.log("Datos guardados:", updatedData);
    } catch (error) {
      console.error("Error guardando en localStorage:", error);
    }
  };

  return (
    <main className="main">
      <form onSubmit={handleSubmit} className="form-container">
        <label>
          <h3>Familia de carreras</h3>
          <select value={option1} onChange={(e) => setOption1(e.target.value)}>
            {select1Options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          <h3>Asignatura</h3>
          <select value={option2} onChange={(e) => setOption2(e.target.value)}>
            {select2Options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        {option1 && option2 && option1 !== "Seleccione..." && option2 !== "Seleccione..." && (
          <>
            <h4>Profesor</h4>
            <select value={option5} onChange={(e) => setOption5(e.target.value)}>
              {select5Options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <h4>Duracion en horas</h4>
            <select value={option6} onChange={(e) => setOption6(e.target.value)}>
              {select6Options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </>
        )}

        <label>
          <h3>Cuatrimestre</h3>
          <select value={option3} onChange={(e) => setOption3(e.target.value)}>
            {!option1 || option1 === "Seleccione..." || !option2 || option2 === "Seleccione..." ? (
              <option value={select3Options[0]}>{select3Options[0]}</option>
            ) : (
              select3Options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))
            )}
          </select>
        </label>

        <label>
          <h3>Cantidad de unidades de aprendizaje</h3>
          <select value={option4} onChange={(e) => setOption4(e.target.value)}>
            {!option1 || option1 === "Seleccione..." || !option2 || option2 === "Seleccione..." ? (
              <option value="Seleccione...">Seleccione...</option>
            ) : (
              select4Options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))
            )}
          </select>
        </label>
        {option1 && option2 && option1 !== "Seleccione..." && option2 !== "Seleccione..." && (
          <div className="text-area-container">
            <div className="textarea">
              <h4>Competencia</h4>
              <textarea value={textArea1} onChange={(e) => setTextArea1(e.target.value)}></textarea>
            </div>
            <div className="textarea">
              <h4>Objetivo general de la asignatura</h4>
              <textarea value={textArea2} onChange={(e) => setTextArea2(e.target.value)}></textarea>
            </div>
          </div>
        )}

        {option4 && option4 !== "Seleccione..." && (
          <div className="content">
            <h3>Detalles de unidades de aprendizaje</h3>
            <div className="titles">
              <h4 className="title-title">Titulo</h4>
              <h4 className="title-competence">Competencia específica</h4>
              <h4 className="title-week">Semanas</h4>
              <h4 className="title-result">Resultado de aprendizaje</h4>
              <h4 className="title-knowledge">Saber</h4>
              <h4 className="title-skill">Hacer-ser</h4>
            </div>
            {units.map((unit, index) => (
              <div key={index} className="unit-container">
                <textarea
                  placeholder={`Titulo competencia ${index + 1}`}
                  value={unit.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                />
                <textarea
                  placeholder={`Competencia específica ${index + 1}`}
                  value={unit.specificCompetency}
                  onChange={(e) => handleChange(index, "specificCompetency", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Número semanas"
                  min="1"
                  max="10"
                  value={unit.weeks}
                  onChange={(e) => handleChange(index, "weeks", e.target.value)}
                />
                <textarea
                  placeholder={`Resultado de aprendizaje ${index + 1}`}
                  value={unit.learningOutcome}
                  onChange={(e) => handleChange(index, "learningOutcome", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Saber"
                  min="0"
                  value={unit.knowledge}
                  onChange={(e) => handleChange(index, "knowledge", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Hacer-ser"
                  min="0"
                  value={unit.skill}
                  onChange={(e) => handleChange(index, "skill", e.target.value)}
                />
              </div>
            ))}

            <div className="sum">
              <div className="weeks">
                <h4>Total de semanas: {totalWeeks}</h4>
              </div>
              <h4>Total saber: {totalKnowledge}%</h4>
              <h4>Total hacer-ser: {totalSkill}%</h4>
            </div>
          </div>
        )}

        <button type="submit">Enviar</button>
      </form>
      <div className="buttons">
        <button
          onClick={() => {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
          }}
        >
          Borrar datos
        </button>
        <button onClick={() => console.log(JSON.stringify(formData, null, 2))}>Mostrar datos en log</button>
      </div>
      {formData.length > 0 && (
        <div className="info">
          {formData.map((data) => (
            <div className="outer-square">
              <div className="first-row">
                <div className="row1">Asignatura:</div>
                <div className="row2">{data.option2}</div>
                <div className="row3">Familia:</div>
                <div className="row4">{data.option1}</div>
                <div className="row5">Duración:</div>
                <div className="row6">{data.option6} hrs</div>
              </div>
              <div className="second-row">
                <div className="row7">Cuatrimestre:</div>
                <div className="row8">{data.option3}</div>
                <div className="row9">Profesor:</div>
                <div className="row10">{data.option5}</div>
              </div>
              <div className="third-row">
                <div className="row11">Competencia:</div>
                <div className="row12">{data.textArea1}</div>
              </div>
              <div className="fourth-row">
                <div className="row13">Objetivo general:</div>
                <div className="row14">{data.textArea2}</div>
              </div>
              <div className="units">
                <div className="headers">
                  <div className="a1">*U.A.</div>
                  <div className="a2">Competencia específica por UA</div>
                  <div className="a3">Num Semanas</div>
                  <div className="a4">Resultado de aprendizaje (P)</div>
                  <div className="a5">**TI (Si/no)</div>
                  <div className="a6">
                    <div>Ponderacion para evaluacion</div>
                    <div className="b1">
                      <div className="b2">Saber (C)</div>
                      <div className="b3">Hacer-Ser(D)</div>
                    </div>
                  </div>
                </div>
                {data.units.map((unit, index) => (
                  <div key={index} className="unit">
                    <div className="c1">{unit.title}</div>
                    <div className="c2">{unit.specificCompetency}</div>
                    <div className="c3">{unit.weeks}</div>
                    <div className="c4">{unit.learningOutcome}</div>
                    <div className="c5">{data.option1 == "Tics" ? "Si" : "No"}</div>
                    <div className="c6">{unit.skill}</div>
                    <div className="c7">{unit.knowledge}</div>
                  </div>
                ))}
                <div className="results">
                  <div className="d1"></div>
                  <div className="d2"></div>
                  <div className="d3">{data.units.reduce((sum, unit) => sum + Number(unit.weeks || 0), 0)}</div>
                  <div className="d4"></div>
                  <div className="d5"></div>
                  <div className="d6">{data.units.reduce((sum, unit) => sum + Number(unit.skill || 0), 0)}</div>
                  <div className="d7">{data.units.reduce((sum, unit) => sum + Number(unit.knowledge || 0), 0)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;

//TODO: Crear la cuadricula con toda la información cuando se da el submit
