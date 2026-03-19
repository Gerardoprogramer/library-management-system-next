
export const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "---";
    
    try {
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) return "---";

        return date.toLocaleDateString('es-CR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC' 
        });
    } catch (error) {
        return "---";
    }
}