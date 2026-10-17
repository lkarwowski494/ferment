import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { t } from '../../lib/i18n';
import { CanonicalRecipe } from '../../core/canonical-recipes';
import { styles } from './calculator.styles';

interface CanonicalRecipesCardProps {
  activeRecipes: CanonicalRecipe[];
  selectedRecipeId: string | null;
  selectedRecipe?: CanonicalRecipe;
  handleSelectRecipe: (r: CanonicalRecipe) => void;
  handleCopyShareLink: (r: CanonicalRecipe) => void;
  handleImportRecipeFromClipboard: () => void;
}

export const CanonicalRecipesCard: React.FC<CanonicalRecipesCardProps> = ({
  activeRecipes,
  selectedRecipeId,
  selectedRecipe,
  handleSelectRecipe,
  handleCopyShareLink,
  handleImportRecipeFromClipboard,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardMiniTitle}>📜 {t('Receptury Kanoniczne & Wymiana')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
        {activeRecipes.map((r) => {
          const isSel = r.id === selectedRecipeId;
          return (
            <TouchableOpacity
              key={r.id}
              style={[styles.presetPill, isSel && styles.presetPillActive]}
              onPress={() => handleSelectRecipe(r)}
            >
              <Text style={[styles.presetPillText, isSel && styles.presetPillTextActive]}>
                {r.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selectedRecipe && (
        <View style={styles.recipeDetailCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.recipeDetailName}>{selectedRecipe.name}</Text>
            <Text style={styles.recipeDetailCode}>{selectedRecipe.code}</Text>
          </View>
          <Text style={styles.recipeDetailText}>
            • {t('Wydajność:')} <Text style={styles.boldText}>{selectedRecipe.targetYieldPer10Units}</Text>
          </Text>
          <Text style={styles.recipeDetailText}>
            • {t('Dojrzewanie:')} <Text style={styles.boldText}>{selectedRecipe.agingDays} dni</Text> ({selectedRecipe.optimalConditions.targetTempC})
          </Text>
          <Text style={styles.recipeDetailText}>
            • pH: <Text style={styles.boldText}>{selectedRecipe.optimalConditions.phMilestone}</Text>
          </Text>
          <Text style={styles.recipeKeyTechnique}>
            💡 {t('Kluczowa technika:')} {selectedRecipe.keyTechnique}
          </Text>
          <View style={styles.recipeBtnRow}>
            <TouchableOpacity
              style={styles.recipeShareBtn}
              onPress={() => handleCopyShareLink(selectedRecipe)}
            >
              <Text style={styles.recipeShareBtnText}>🔗 {t('Kopiuj Link Receptury (ferment://)')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.recipeImportBtn}
              onPress={handleImportRecipeFromClipboard}
            >
              <Text style={styles.recipeImportBtnText}>📥 {t('Wczytaj ze Schowka')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
