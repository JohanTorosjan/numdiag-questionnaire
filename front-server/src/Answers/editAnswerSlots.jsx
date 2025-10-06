import { useState,useEffect } from 'react';
import { useToast } from '../ToastSystem';


async function getTranches(questionId){
    try {
        const response = await fetch(`http://localhost:3008/questions/${questionId}/tranches`);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des tranches');
        }
        const data = await response.json();
        console.log('tranches : ', data);
        return data;
    } catch (error) {
        console.error('Error fetching questionnaire:', error);
        return null;
    }
}

function PopUpEditAnswerSlots({ answer, answerType, onClose, onSave,questionId}) {
    const toast = useToast();
    const [tranches, setTranches] = useState([]);
    const [errors, setErrors] = useState({});



    useEffect(() => {
        async function fetchTranches() {
            const data = await getTranches(questionId);
            setTranches(data);
            }
            fetchTranches();
        }, [questionId]);
    


    const addTranche = () => {
        setTranches([...tranches, { min: '', max: '', value: '', recommandation: '', plafond: '' }]);
    };

    const removeTranche = (index) => {
        setTranches(tranches.filter((_, i) => i !== index));
    };

    const updateTranche = (index, field, value) => {
        const updated = [...tranches];
        updated[index] = { ...updated[index], [field]: value };
        setTranches(updated);
        
        // Effacer l'erreur pour ce champ
        if (errors[`${index}-${field}`]) {
            const newErrors = { ...errors };
            delete newErrors[`${index}-${field}`];
            setErrors(newErrors);
        }
    };

    const validate = () => {
        const newErrors = {};
        
        tranches.forEach((tranche, index) => {
            if (tranche.min === '' || tranche.min === null) {
                newErrors[`${index}-min`] = 'Min requis';
            }
            if (tranche.max === '' || tranche.max === null) {
                newErrors[`${index}-max`] = 'Max requis';
            }
            if (tranche.value === '' || tranche.value === null) {
                newErrors[`${index}-value`] = 'Valeur requise';
            }
            
            const min = parseInt(tranche.min);
            const max = parseInt(tranche.max);
            
            if (!isNaN(min) && !isNaN(max) && min > max) {
                newErrors[`${index}-range`] = 'Min doit être <= Max';
            }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) {
            toast.showError('Veuillez corriger les erreurs');
            return;
        }
        
        const formattedTranches = tranches.map(t => ({
            ...t,
            min: parseInt(t.min),
            max: parseInt(t.max),
            value: parseInt(t.value),
            recommandation: t.recommandation || null,
            plafond: t.plafond ? parseInt(t.plafond) : null
        }));
        

        try {
            await onSave({ ...answer, tranches: formattedTranches });
            toast.showSuccess('Tranches enregistrées');
            onClose();
        }
        catch(e){
            console.log(e)
            toast.showError('Erreur d enregistrement');
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Modifier les tranches</h2>
                    <button style={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                
                <div style={styles.content}>

                    <div style={styles.tranchesContainer}>
                        {tranches.length === 0 ? (
                            <p style={styles.emptyText}>Aucune tranche définie</p>
                        ) : (
                            tranches.map((tranche, index) => (
                                <div key={index} style={styles.trancheRow}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Min</label>
                                        <input
                                            type="number"
                                            style={{
                                                ...styles.input,
                                                ...(errors[`${index}-min`] ? styles.inputError : {})
                                            }}
                                            value={tranche.min}
                                            onChange={(e) => updateTranche(index, 'min', e.target.value)}
                                            placeholder="0"
                                        />
                                        {errors[`${index}-min`] && (
                                            <span style={styles.errorText}>{errors[`${index}-min`]}</span>
                                        )}
                                    </div>

                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Max</label>
                                        <input
                                            type="number"
                                            style={{
                                                ...styles.input,
                                                ...(errors[`${index}-max`] ? styles.inputError : {})
                                            }}
                                            value={tranche.max}
                                            onChange={(e) => updateTranche(index, 'max', e.target.value)}
                                            placeholder="100"
                                        />
                                        {errors[`${index}-max`] && (
                                            <span style={styles.errorText}>{errors[`${index}-max`]}</span>
                                        )}
                                    </div>

                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Valeur</label>
                                        <input
                                            type="number"
                                            style={{
                                                ...styles.input,
                                                ...(errors[`${index}-value`] ? styles.inputError : {})
                                            }}
                                            value={tranche.value}
                                            onChange={(e) => updateTranche(index, 'value', e.target.value)}
                                            placeholder="Points"
                                        />
                                        {errors[`${index}-value`] && (
                                            <span style={styles.errorText}>{errors[`${index}-value`]}</span>
                                        )}
                                    </div>

                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Plafond (opt.)</label>
                                        <input
                                            type="number"
                                            style={styles.input}
                                            value={tranche.plafond}
                                            onChange={(e) => updateTranche(index, 'plafond', e.target.value)}
                                            placeholder="Max"
                                        />
                                    </div>

                                    <button
                                        style={styles.deleteBtn}
                                        onClick={() => removeTranche(index)}
                                        title="Supprimer"
                                    >
                                        🗑️
                                    </button>
                                    
                                    {errors[`${index}-range`] && (
                                        <span style={styles.errorTextFull}>{errors[`${index}-range`]}</span>
                                    )}
                                    
                                    <div style={styles.fullWidthInput}>
                                        <label style={styles.label}>Recommandation (optionnelle)</label>
                                        <textarea
                                            style={styles.textarea}
                                            value={tranche.recommandation}
                                            onChange={(e) => updateTranche(index, 'recommandation', e.target.value)}
                                            placeholder="Ajouter une recommandation..."
                                            rows="2"
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <button style={styles.addBtn} onClick={addTranche}>
                        + Ajouter une tranche
                    </button>
                </div>

                <div style={styles.footer}>
                    <button style={styles.cancelBtn} onClick={onClose}>
                        Annuler
                    </button>
                    <button style={styles.saveBtn} onClick={handleSave}>
                        Enregistrer
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    popup: {
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid #e5e7eb',
    },
    title: {
        margin: 0,
        fontSize: '20px',
        fontWeight: '600',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '28px',
        cursor: 'pointer',
        color: '#6b7280',
        padding: '0',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: '20px',
        flex: 1,
        overflowY: 'auto',
    },
    answerInfo: {
        backgroundColor: '#f3f4f6',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px',
        fontSize: '14px',
    },
    tranchesContainer: {
        marginBottom: '20px',
    },
    emptyText: {
        textAlign: 'center',
        color: '#6b7280',
        padding: '20px',
    },
    trancheRow: {
        display: 'flex',
        gap: '10px',
        marginBottom: '15px',
        padding: '15px',
        backgroundColor: '#f9fafb',
        borderRadius: '6px',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        position: 'relative',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
        minWidth: '100px',
    },
    label: {
        fontSize: '12px',
        fontWeight: '500',
        marginBottom: '4px',
        color: '#374151',
    },
    input: {
        padding: '8px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '14px',
    },
    inputError: {
        borderColor: '#ef4444',
    },
    errorText: {
        fontSize: '11px',
        color: '#ef4444',
        marginTop: '2px',
    },
    errorTextFull: {
        fontSize: '11px',
        color: '#ef4444',
        width: '100%',
        marginTop: '5px',
    },
    deleteBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '20px',
        padding: '8px',
        marginTop: '18px',
    },
    addBtn: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    footer: {
        display: 'flex',
        gap: '10px',
        padding: '20px',
        borderTop: '1px solid #e5e7eb',
        justifyContent: 'flex-end',
    },
    cancelBtn: {
        padding: '10px 20px',
        backgroundColor: '#f3f4f6',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    saveBtn: {
        padding: '10px 20px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
};

export default PopUpEditAnswerSlots;