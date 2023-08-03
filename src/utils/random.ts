/**
 * 
 * @returns 
 */
export function randColor() {
    return (~~(Math.random()*(1<<24))).toString(16)
}