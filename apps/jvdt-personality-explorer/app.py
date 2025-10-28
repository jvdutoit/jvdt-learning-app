import streamlit as st
import pandas as pd
import math
import matplotlib.pyplot as plt

st.set_page_config(page_title="JVDT Personality Explorer", page_icon="📊", layout="centered")

st.title("JVDT Personality Explorer")
st.write("Play with the seven JVDT-7 axes and instantly see the radar chart.")

axes = [
    "Perception", "Interpretation", "Reflection", "Application", "Motivation", "Orientation", "Value Expression"
]

with st.sidebar:
    st.header("Scores (0–100)")
    scores = [st.slider(ax, 0, 100, 70) for ax in axes]

# Radar chart
angles = [n / float(len(axes)) * 2 * math.pi for n in range(len(axes))]
angles += angles[:1]
vals = scores + scores[:1]

fig = plt.figure()
ax = plt.subplot(111, polar=True)
ax.set_theta_offset(math.pi / 2)
ax.set_theta_direction(-1)
ax.set_xticks(angles[:-1])
ax.set_xticklabels(axes)
ax.set_rlabel_position(0)
ax.plot(angles, vals, linewidth=2)
ax.fill(angles, vals, alpha=0.1)
st.pyplot(fig)

st.divider()
st.subheader("Download your profile")
df = pd.DataFrame({"Axis": axes, "Score": scores})
st.dataframe(df, hide_index=True)
st.download_button("Download CSV", data=df.to_csv(index=False), file_name="jvdt7_profile.csv", mime="text/csv")

st.caption("Prototype · For educational use")
